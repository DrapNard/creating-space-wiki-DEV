// GitHub Configuration
export const GITHUB_CONFIG = {
  apiUrl: 'https://api.github.com',
  repoOwner: 'DrapNard',
  repoName: 'creating_space.wiki',
  defaultBranch: 'main',
};

// GitHub API endpoints
export const GITHUB_ENDPOINTS = {
  createFork: (owner, repo) => `/repos/${owner}/${repo}/forks`,
  createRef: (owner, repo) => `/repos/${owner}/${repo}/git/refs`,
  updateContent: (owner, repo, path) => `/repos/${owner}/${repo}/contents/${path}`,
  createPullRequest: (owner, repo) => `/repos/${owner}/${repo}/pulls`,
};

// GitHub API request headers
export const getHeaders = (token) => ({
  Authorization: `token ${token}`,
  Accept: 'application/vnd.github.v3+json',
});