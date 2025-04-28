import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import WikiEditor from './components/WikiEditor';
import Home from './components/Home';
import EditPage from './components/EditPage';
import { ThemeProvider } from './contexts/ThemeContext';
import './styles/main.scss';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <Sidebar />
          <div id="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/edit" element={<EditPage />} />
              <Route path="/edit/:pagePath" element={<EditPage />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;