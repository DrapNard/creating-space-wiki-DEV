import React, { useState } from 'react';
import axios from 'axios';
import { GITHUB_CONFIG, GITHUB_ENDPOINTS, getHeaders } from '../config/github';
import { getAuthToken } from '../config/auth';

const WikiEditor = ({ template, onSave }) => {
  const [content, setContent] = useState(template || '');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const githubToken = getAuthToken();
      if (!githubToken) {
        throw new Error('Authentication required');
      }

      // Create fork
      const forkResponse = await axios.post(
        `${GITHUB_CONFIG.apiUrl}${GITHUB_ENDPOINTS.createFork(GITHUB_CONFIG.repoOwner, GITHUB_CONFIG.repoName)}`,
        {},
        { headers: getHeaders(githubToken) }
      );

      // Create new branch
      const branchName = `wiki-edit-${Date.now()}`;
      await axios.post(
        `${GITHUB_CONFIG.apiUrl}${GITHUB_ENDPOINTS.createRef(forkResponse.data.owner.login, GITHUB_CONFIG.repoName)}`,
        {
          ref: `refs/heads/${branchName}`,
          sha: forkResponse.data.default_branch.sha,
        },
        { headers: getHeaders(githubToken) }
      );

      // Commit changes
      const commitResponse = await axios.put(
        `${GITHUB_CONFIG.apiUrl}${GITHUB_ENDPOINTS.updateContent(forkResponse.data.owner.login, GITHUB_CONFIG.repoName, `${title}.html`)}`,
        {
          message: `Add/Update ${title}`,
          content: btoa(content),
          branch: branchName,
        },
        { headers: getHeaders(githubToken) }
      );

      // Create pull request
      await axios.post(
        `${GITHUB_CONFIG.apiUrl}${GITHUB_ENDPOINTS.createPullRequest(GITHUB_CONFIG.repoOwner, GITHUB_CONFIG.repoName)}`,
        {
          title: `Wiki: ${title}`,
          body: description,
          head: `${forkResponse.data.owner.login}:${branchName}`,
          base: GITHUB_CONFIG.defaultBranch,
        },
        { headers: getHeaders(githubToken) }
      );

      onSave && onSave();
    } catch (error) {
      console.error('Error submitting changes:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="wiki-editor">
      <form onSubmit={handleSubmit}>
        <div className="editor-field">
          <label htmlFor="title">Page Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="editor-field">
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="20"
            required
          />
        </div>

        <div className="editor-field">
          <label htmlFor="description">Pull Request Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            required
          />
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Changes'}
        </button>
      </form>
    </div>
  );
};

export default WikiEditor;