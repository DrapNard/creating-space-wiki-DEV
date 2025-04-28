import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [navMenu, setNavMenu] = useState([]);

  useEffect(() => {
    // Load menu state from localStorage
    try {
      const savedMenuHtml = localStorage.getItem('navMenuState');
      if (savedMenuHtml) {
        setNavMenu(JSON.parse(savedMenuHtml));
      }
    } catch (error) {
      console.error('Error loading menu state:', error);
    }
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    // Implement search functionality here
  };

  return (
    <header>
      <div id="header" style={{ 
        display: 'flex', 
        alignContent: 'center', 
        flexDirection: 'column' 
      }}>
        <h1>Creating Space Wiki</h1>
        <img 
          width="200" 
          height="200" 
          src="https://cdn.discordapp.com/attachments/1134250316913717298/1269799646851760261/image.png" 
          style={{ alignSelf: 'center' }} 
          alt="Wiki Logo"
        />
        <div id="header-content" style={{ alignSelf: 'center' }}>
          <nav>
            <ul id="nav-menu">
              {/* Dynamic navigation will be generated here */}
              {navMenu.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </nav>
          <input 
            type="text" 
            id="search-bar" 
            placeholder="Search..." 
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;