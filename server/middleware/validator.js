const Joi = require('joi');
const logger = require('../utils/logger');

/**
 * Validate GitHub repository URL
 */
const githubUrlSchema = Joi.object({
  repoUrl: Joi.string()
    .uri()
    .pattern(/^https:\/\/github\.com\/[\w-]+\/[\w.-]+\/?$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid GitHub URL format. Expected: https://github.com/username/repository',
      'string.uri': 'Must be a valid URL',
      'any.required': 'Repository URL is required',
    }),
});

/**
 * Middleware to validate analyze request
 */
const validateAnalyzeRequest = (req, res, next) => {
  const { error, value } = githubUrlSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path[0],
      message: detail.message,
    }));

    logger.warn('Validation failed', { errors, body: req.body });

    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      code: 'VALIDATION_ERROR',
      details: errors,
    });
  }

  // Attach validated data to request
  req.validatedData = value;
  next();
};

/**
 * Extract repository info from GitHub URL
 */
const extractRepoInfo = (repoUrl) => {
  try {
    const url = new URL(repoUrl);
    const pathParts = url.pathname.split('/').filter(Boolean);
    
    if (pathParts.length >= 2) {
      return {
        owner: pathParts[0],
        repo: pathParts[1].replace('.git', ''),
        fullName: `${pathParts[0]}/${pathParts[1].replace('.git', '')}`,
      };
    }
    
    return null;
  } catch (error) {
    logger.error('Failed to extract repo info', error);
    return null;
  }
};

/**
 * Sanitize repository name for safe file system usage
 */
const sanitizeRepoName = (repoName) => {
  return repoName
    .replace(/[^a-zA-Z0-9-_]/g, '-')
    .replace(/--+/g, '-')
    .toLowerCase();
};

module.exports = {
  validateAnalyzeRequest,
  extractRepoInfo,
  sanitizeRepoName,
};

// Made with Bob
