// utils/tokenUtils.js
/**
 * Utility functions for token validation and management
 */

/**
 * Validate if the access token is still valid by making a test API call
 * @param {string} accessToken - The Google access token
 * @returns {Promise<boolean>} - True if token is valid, false otherwise
 */
export async function validateGoogleToken(accessToken) {
  try {
    const response = await fetch('https://www.googleapis.com/oauth2/v1/tokeninfo', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
    
    return response.ok
  } catch (error) {
    console.error('Token validation error:', error)
    return false
  }
}

/**
 * Get user's Gmail profile to test token validity
 * @param {string} accessToken - The Google access token
 * @returns {Promise<Object|null>} - User profile or null if invalid
 */
export async function getGmailProfile(accessToken) {
  try {
    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Gmail profile fetch error:', error)
    return null
  }
}

/**
 * Check if token is close to expiring (within 5 minutes)
 * @param {number} expiresAt - Token expiration timestamp
 * @returns {boolean} - True if token expires soon
 */
export function isTokenExpiringSoon(expiresAt) {
  const fiveMinutesFromNow = Date.now() + (5 * 60 * 1000)
  return expiresAt < fiveMinutesFromNow
}

/**
 * Format token expiration time for display
 * @param {number} expiresAt - Token expiration timestamp
 * @returns {string} - Formatted expiration time
 */
export function formatTokenExpiration(expiresAt) {
  const expirationDate = new Date(expiresAt)
  const now = new Date()
  const diffMinutes = Math.floor((expirationDate - now) / (1000 * 60))
  
  if (diffMinutes <= 0) {
    return 'Expired'
  } else if (diffMinutes < 60) {
    return `Expires in ${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''}`
  } else {
    const diffHours = Math.floor(diffMinutes / 60)
    return `Expires in ${diffHours} hour${diffHours !== 1 ? 's' : ''}`
  }
}