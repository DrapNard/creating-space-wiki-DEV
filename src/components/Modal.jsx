import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const Modal = ({ isOpen, onClose, children }) => {
  const { isDarkMode } = useTheme();

  if (!isOpen) return null;

  return (
    <div className={`modal-overlay ${isDarkMode ? 'dark' : 'light'}`} onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export default Modal;