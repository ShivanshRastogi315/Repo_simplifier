const simpleGit = require('simple-git');
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');
const { TEMP_DIR, MAX_REPO_SIZE_MB } = require('../config/constants');
const { extractRepoInfo, sanitizeRepoName } = require('../middleware/validator');

class GitService {
  constructor() {
    this.git = simpleGit();
  }

  /**
   * Validate if URL is a public GitHub repository
   */
  async validateRepository(repoUrl) {
    try {
      const repoInfo = extractRepoInfo(repoUrl);
      if (!repoInfo) {
        return { valid: false, error: 'Invalid repository URL format' };
      }

      // Check if repository exists and is public using GitHub API
      const apiUrl = `https://api.github.com/repos/${repoInfo.fullName}`;
      const response = await fetch(apiUrl);
      
      if (response.status === 404) {
        return { valid: false, error: 'Repository not found or is private' };
      }
      
      if (!response.ok) {
        return { valid: false, error: 'Failed to validate repository' };
      }

      const repoData = await response.json();
      
      // Check repository size (GitHub API returns size in KB)
      const sizeInMB = repoData.size / 1024;
      if (sizeInMB > MAX_REPO_SIZE_MB) {
        return {
          valid: false,
          error: `Repository too large (${sizeInMB.toFixed(2)}MB). Maximum allowed: ${MAX_REPO_SIZE_MB}MB`,
        };
      }

      return {
        valid: true,
        repoInfo: {
          ...repoInfo,
          name: repoData.name,
          description: repoData.description,
          stars: repoData.stargazers_count,
          language: repoData.language,
          size: sizeInMB,
          defaultBranch: repoData.default_branch,
        },
      };
    } catch (error) {
      logger.error('Repository validation failed', error);
      return { valid: false, error: 'Failed to validate repository' };
    }
  }

  /**
   * Clone repository to temporary folder
   */
  async cloneRepository(repoUrl, repoInfo) {
    const uniqueId = uuidv4();
    const sanitizedName = sanitizeRepoName(repoInfo.fullName);
    const tempFolderName = `${sanitizedName}-${uniqueId}`;
    const tempPath = path.join(TEMP_DIR, tempFolderName);

    try {
      // Ensure temp directory exists
      await fs.ensureDir(TEMP_DIR);

      logger.info(`Cloning repository: ${repoInfo.fullName}`, { tempPath });

      // Clone with depth 1 for faster cloning (shallow clone)
      await this.git.clone(repoUrl, tempPath, ['--depth', '1']);

      logger.success(`Repository cloned successfully: ${repoInfo.fullName}`);

      return {
        success: true,
        tempPath,
        tempFolderName,
      };
    } catch (error) {
      logger.error('Failed to clone repository', error);
      
      // Clean up partial clone if it exists
      if (await fs.pathExists(tempPath)) {
        await fs.remove(tempPath);
      }

      return {
        success: false,
        error: 'Failed to clone repository. Please ensure the URL is correct and the repository is public.',
      };
    }
  }

  /**
   * Get repository statistics
   */
  async getRepositoryStats(tempPath) {
    try {
      const stats = {
        totalFiles: 0,
        totalSize: 0,
        fileTypes: {},
      };

      const scanDirectory = async (dirPath) => {
        const items = await fs.readdir(dirPath);

        for (const item of items) {
          const itemPath = path.join(dirPath, item);
          const itemStats = await fs.stat(itemPath);

          if (itemStats.isDirectory()) {
            // Skip .git directory
            if (item !== '.git') {
              await scanDirectory(itemPath);
            }
          } else {
            stats.totalFiles++;
            stats.totalSize += itemStats.size;

            const ext = path.extname(item).toLowerCase();
            if (ext) {
              stats.fileTypes[ext] = (stats.fileTypes[ext] || 0) + 1;
            }
          }
        }
      };

      await scanDirectory(tempPath);

      return {
        ...stats,
        totalSizeMB: (stats.totalSize / (1024 * 1024)).toFixed(2),
      };
    } catch (error) {
      logger.error('Failed to get repository stats', error);
      return null;
    }
  }

  /**
   * Check if path is safe (within temp directory)
   */
  isSafePath(targetPath) {
    const normalizedTarget = path.normalize(targetPath);
    const normalizedTemp = path.normalize(TEMP_DIR);
    return normalizedTarget.startsWith(normalizedTemp);
  }
}

module.exports = new GitService();

// Made with Bob
