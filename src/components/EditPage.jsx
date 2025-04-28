import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import WikiEditor from './WikiEditor';
import Modal from './Modal';
import axios from 'axios';
import { GITHUB_CONFIG, GITHUB_ENDPOINTS, getHeaders } from '../config/github';
import { getAuthToken } from '../config/auth';

const EditPage = () => {
  const { pagePath } = useParams();
  const navigate = useNavigate();
  const [template, setTemplate] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const token = getAuthToken();
        if (pagePath) {
          const response = await axios.get(
            `${GITHUB_CONFIG.apiUrl}${GITHUB_ENDPOINTS.updateContent(GITHUB_CONFIG.repoOwner, GITHUB_CONFIG.repoName, `categories/${pagePath}.html`)}`,
            { headers: token ? getHeaders(token) : {} }
          );
          const content = atob(response.data.content);
          setTemplate(content);
        } else {
          // Load default template for new pages
          const response = await axios.get(
            `${GITHUB_CONFIG.apiUrl}${GITHUB_ENDPOINTS.updateContent(GITHUB_CONFIG.repoOwner, GITHUB_CONFIG.repoName, 'templates/default.html')}`,
            { headers: token ? getHeaders(token) : {} }
          );
          const content = atob(response.data.content);
          setTemplate(content);
        }
      } catch (error) {
        console.error('Error fetching template:', error);
        setTemplate(''); // Set empty template on error
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [pagePath]);

  const handleSave = () => {
    // Navigate back to the view page after successful save
    navigate(`/view/${pagePath || ''}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Modal isOpen={true} onClose={() => navigate('/')}>
      <div className="edit-page">
        <h1>{pagePath ? 'Edit Page' : 'Create New Page'}</h1>
        <WikiEditor template={template} onSave={handleSave} />
      </div>
    </Modal>
  );
};

export default EditPage;