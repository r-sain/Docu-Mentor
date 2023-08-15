import React, { useState } from 'react';
import './SimpleModal.css'; // Import your modal CSS file

const SimpleModal = ({ open, onClose, onYes, onNo }) => {
  return (
    <div className={`modal ${open ? 'open' : ''}`}>
      <div className="modal-content">
        <div className="modalTop">
          <h2>Do you want to save the document?</h2>
        </div>
        <div className="modalBottom">
          <button id='yes' onClick={onYes}>Yes</button>
          <button id='no' onClick={onNo}>No</button>
          <button id='continue' onClick={onClose}>Keep editing</button>
        </div>
      </div>
    </div>
  );
};

export default SimpleModal;
