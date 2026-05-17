/**
 * API Service for FlowBase
 * Handles all communication with the backend server
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Generic fetch wrapper with error handling
 */
async function fetchWithErrorHandling(url, options = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        data.error || 'An error occurred',
        response.status,
        data
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Network or other errors
    throw new ApiError(
      error.message || 'Network error occurred',
      0,
      null
    );
  }
}

/**
 * Analyze a GitHub repository (synchronous - returns complete results)
 * @param {string} repoUrl - GitHub repository URL
 * @returns {Promise<Object>} Complete analysis results
 */
export async function analyzeRepository(repoUrl) {
  const url = `${API_BASE_URL}/api/analyze`;
  
  if (!repoUrl || typeof repoUrl !== 'string') {
    throw new ApiError('Invalid repository URL', 400, null);
  }
  
  const response = await fetchWithErrorHandling(url, {
    method: 'POST',
    body: JSON.stringify({ repoUrl }),
  });
  
  // Validate response structure
  if (!response) {
    throw new ApiError('No response from server', 500, null);
  }
  
  if (!response.success) {
    throw new ApiError(
      response.error || 'Analysis failed',
      response.code === 'INVALID_REPOSITORY' ? 400 : 500,
      response
    );
  }
  
  if (!response.data) {
    throw new ApiError('No data in response', 500, response);
  }
  
  return response;
}

/**
 * Health check endpoint
 * @returns {Promise<Object>} Server health status
 */
export async function healthCheck() {
  const url = `${API_BASE_URL}/health`;
  
  return fetchWithErrorHandling(url, {
    method: 'GET',
  });
}

export default {
  analyzeRepository,
  healthCheck,
  ApiError,
};
