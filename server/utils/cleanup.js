const fs = require('fs-extra');
const path = require('path');
const logger = require('./logger');
const { TEMP_DIR } = require('../config/constants');

class CleanupManager {
  constructor() {
    this.activeFolders = new Set();
    this.cleanupInterval = null;
  }

  /**
   * Initialize cleanup manager with scheduled cleanup
   */
  initialize() {
    // Ensure temp directory exists
    fs.ensureDirSync(TEMP_DIR);
    
    // Schedule cleanup every hour
    this.cleanupInterval = setInterval(() => {
      this.cleanupOrphanedFolders();
    }, 3600000); // 1 hour

    logger.info('Cleanup manager initialized');
  }

  /**
   * Register a folder as active (being used)
   */
  registerFolder(folderPath) {
    this.activeFolders.add(folderPath);
    logger.debug(`Registered active folder: ${folderPath}`);
  }

  /**
   * Unregister a folder (no longer in use)
   */
  unregisterFolder(folderPath) {
    this.activeFolders.delete(folderPath);
    logger.debug(`Unregistered folder: ${folderPath}`);
  }

  /**
   * Clean up a specific folder immediately
   */
  async cleanupFolder(folderPath) {
    try {
      if (fs.existsSync(folderPath)) {
        await fs.remove(folderPath);
        logger.success(`Cleaned up folder: ${folderPath}`);
        this.unregisterFolder(folderPath);
        return true;
      }
      return false;
    } catch (error) {
      logger.error(`Failed to cleanup folder: ${folderPath}`, error);
      return false;
    }
  }

  /**
   * Clean up orphaned folders (older than 1 hour and not active)
   */
  async cleanupOrphanedFolders() {
    try {
      if (!fs.existsSync(TEMP_DIR)) {
        return;
      }

      const folders = await fs.readdir(TEMP_DIR);
      const now = Date.now();
      const oneHourAgo = now - 3600000;
      let cleanedCount = 0;

      for (const folder of folders) {
        const folderPath = path.join(TEMP_DIR, folder);
        
        // Skip if folder is currently active
        if (this.activeFolders.has(folderPath)) {
          continue;
        }

        try {
          const stats = await fs.stat(folderPath);
          
          // Remove if older than 1 hour
          if (stats.mtimeMs < oneHourAgo) {
            await fs.remove(folderPath);
            cleanedCount++;
            logger.info(`Removed orphaned folder: ${folder}`);
          }
        } catch (error) {
          logger.warn(`Could not check folder: ${folder}`, error);
        }
      }

      if (cleanedCount > 0) {
        logger.success(`Cleaned up ${cleanedCount} orphaned folder(s)`);
      }
    } catch (error) {
      logger.error('Error during orphaned folder cleanup', error);
    }
  }

  /**
   * Clean up all temporary folders (use on shutdown)
   */
  async cleanupAll() {
    try {
      if (fs.existsSync(TEMP_DIR)) {
        const folders = await fs.readdir(TEMP_DIR);
        
        for (const folder of folders) {
          const folderPath = path.join(TEMP_DIR, folder);
          await fs.remove(folderPath);
        }
        
        logger.success(`Cleaned up all temporary folders (${folders.length} total)`);
      }
    } catch (error) {
      logger.error('Error during full cleanup', error);
    }
  }

  /**
   * Stop the cleanup interval
   */
  stop() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
      logger.info('Cleanup manager stopped');
    }
  }

  /**
   * Get statistics about temp folders
   */
  async getStats() {
    try {
      if (!fs.existsSync(TEMP_DIR)) {
        return { totalFolders: 0, activeFolders: 0, totalSizeMB: 0 };
      }

      const folders = await fs.readdir(TEMP_DIR);
      let totalSize = 0;

      for (const folder of folders) {
        const folderPath = path.join(TEMP_DIR, folder);
        try {
          const size = await this.getFolderSize(folderPath);
          totalSize += size;
        } catch (error) {
          // Skip folders we can't access
        }
      }

      return {
        totalFolders: folders.length,
        activeFolders: this.activeFolders.size,
        totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
      };
    } catch (error) {
      logger.error('Error getting cleanup stats', error);
      return { totalFolders: 0, activeFolders: 0, totalSizeMB: 0 };
    }
  }

  /**
   * Get folder size recursively
   */
  async getFolderSize(folderPath) {
    let totalSize = 0;
    const files = await fs.readdir(folderPath);

    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const stats = await fs.stat(filePath);

      if (stats.isDirectory()) {
        totalSize += await this.getFolderSize(filePath);
      } else {
        totalSize += stats.size;
      }
    }

    return totalSize;
  }
}

// Export singleton instance
module.exports = new CleanupManager();

// Made with Bob
