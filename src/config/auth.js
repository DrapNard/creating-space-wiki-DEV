import axios from 'axios';
import { GITHUB_CONFIG } from './github';

const OAUTH_CONFIG = {
  clientId: import.meta.env.VITE_GITHUB_CLIENT_ID,
  redirectUri: `${window.location.origin}/#/auth/callback`,
  scope: 'repo',
  authUrl: 'https://github.com/login/oauth/authorize'
};

export const initiateGithubAuth = () => {
  const params = new URLSearchParams({
    client_id: OAUTH_CONFIG.clientId,
    redirect_uri: OAUTH_CONFIG.redirectUri,
    scope: OAUTH_CONFIG.scope,
    state: generateState(),
  });
  window.location.href = `${OAUTH_CONFIG.authUrl}?${params}`;
};

export const handleAuthCallback = async (code) => {
  try {
    // GitHub's OAuth web flow will provide the token directly in the URL hash
    const params = new URLSearchParams(window.location.hash.substring(1));
    const token = params.get('access_token');
    if (token) {
      localStorage.setItem('github_token', token);
      return token;
    }
    throw new Error('No access token found in URL');
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
};

const generateState = () => {
  const array = new Uint8Array(32);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

export const checkAuthStatus = () => {
  return !!localStorage.getItem('github_token');
};

export const getAuthToken = () => {
  return localStorage.getItem('github_token');
};

export const logout = () => {
  localStorage.removeItem('github_token');
};