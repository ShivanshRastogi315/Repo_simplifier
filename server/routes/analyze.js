const express = require('express');
const router = express.Router();
const gitService = require('../services/gitService');
const analysisService = require('../services/analysisService');
const cleanupManager = require('../utils/cleanup');
const logger = require('../utils/logger');
const { validateAnalyzeRequest } = require('../middleware/validator');
const { analyzeRateLimiter } = require('../middleware/rateLimiter');

/**
 * POST /api/analyze
 * Analyze a GitHub repository
 */
router.post('/', analyzeRateLimiter, validateAnalyzeRequest, async (req, res) => {
  const { repoUrl } = req.validatedData;
  let tempPath = null;

  try {
    logger.info('Received analysis request', { repoUrl, ip: req.ip });

    // Step 1: Validate repository
    const validation = await gitService.validateRepository(repoUrl);
    if (!validation.valid) {
      logger.warn('Repository validation failed', { repoUrl, error: validation.error });
      return res.status(400).json({
        success: false,
        error: validation.error,
        code: 'INVALID_REPOSITORY',
      });
    }

    const { repoInfo } = validation;
    logger.info('Repository validated', { repoInfo });

    // Step 2: Clone repository
    const cloneResult = await gitService.cloneRepository(repoUrl, repoInfo);
    if (!cloneResult.success) {
      logger.error('Clone failed', { repoUrl, error: cloneResult.error });
      return res.status(500).json({
        success: false,
        error: cloneResult.error,
        code: 'CLONE_FAILED',
      });
    }

    tempPath = cloneResult.tempPath;
    cleanupManager.registerFolder(tempPath);
    logger.success('Repository cloned', { tempPath });

    // Step 3: Get repository statistics
    const stats = await gitService.getRepositoryStats(tempPath);
    logger.info('Repository stats', stats);

    // Step 4: Analyze repository
    const analysisResult = await analysisService.analyzeRepository(tempPath, repoInfo);
    
    if (!analysisResult.success) {
      logger.error('Analysis failed', { repoUrl, error: analysisResult.error });
      
      // Cleanup before returning error
      await cleanupManager.cleanupFolder(tempPath);
      
      return res.status(500).json({
        success: false,
        error: analysisResult.error,
        code: 'ANALYSIS_FAILED',
      });
    }

    // Step 5: Cleanup temporary folder
    await cleanupManager.cleanupFolder(tempPath);
    logger.success('Analysis completed and cleaned up', { repoUrl });

    // Step 6: Return results
    return res.json({
      success: true,
      data: analysisResult.data,
      metadata: {
        ...analysisResult.metadata,
        repository: {
          name: repoInfo.name,
          fullName: repoInfo.fullName,
          description: repoInfo.description,
          language: repoInfo.language,
          stars: repoInfo.stars,
        },
        stats,
      },
    });
  } catch (error) {
    logger.error('Unexpected error during analysis', error);

    // Cleanup on error
    if (tempPath) {
      await cleanupManager.cleanupFolder(tempPath);
    }

    return res.status(500).json({
      success: false,
      error: 'An unexpected error occurred during analysis',
      code: 'INTERNAL_ERROR',
    });
  }
});

/**
 * GET /api/analyze/health
 * Health check endpoint
 */
router.get('/health', async (req, res) => {
  try {
    const stats = await cleanupManager.getStats();
    
    res.json({
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      tempFolders: stats,
    });
  } catch (error) {
    logger.error('Health check failed', error);
    res.status(500).json({
      success: false,
      status: 'unhealthy',
      error: error.message,
    });
  }
});

module.exports = router;

// Made with Bob
