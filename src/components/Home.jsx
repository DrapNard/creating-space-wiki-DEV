import React from 'react';

const Home = () => {
  return (
    <div className="home-page">
      <h1>Welcome to Creating Space Wiki</h1>
      <div className="home-content">
        <p>This is your central hub for all space-related knowledge and documentation.</p>
        <div className="quick-actions">
          <button className="create-page-btn" onClick={() => window.location.href = '/edit'}>
            Create New Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;