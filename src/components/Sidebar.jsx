import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    // Load categories from the file system
    const loadCategories = async () => {
      try {
        const response = await fetch('/categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };

    loadCategories();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    // Implement search functionality
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <button className="toggle-btn" onClick={toggleSidebar}>
          {isCollapsed ? '→' : '←'}
        </button>
        <h1>Creating Space Wiki</h1>
        <button className="theme-toggle" onClick={toggleTheme}>
          {isDarkMode ? '☀️' : '🌙'}
        </button>
      </div>

      <div className="sidebar-content">
        <button
          className="create-page-btn"
          onClick={() => navigate('/edit')}
        >
          Create New Page
        </button>
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        <div className="tags-section">
          <h2>Tags</h2>
          <div className="tags-list">
            {tags.map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </div>
        </div>

        <nav className="categories-nav">
          <h2>Categories</h2>
          {categories.map((category, index) => (
            <div key={index} className="category-group">
              <h3>{category.name}</h3>
              <ul>
                {category.pages.map((page, pageIndex) => (
                  <li key={pageIndex}>
                    <a href={page.path}>{page.title}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;