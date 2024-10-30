import React from 'react';
import { X } from 'lucide-react';

const ConfirmDeleteModal = ({ show, onClose, onConfirm, itemName }) => {
    if (!show) return null;
  
    return (
      <div className="modalOverlay">
        <div className="modalContent relative mx-2 p-2" >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 z-20"
          style={{ padding: '10px', cursor: 'pointer' }}
          aria-label="Close"
        >
          <X className="bg-indigo-500 rounded-full text-white p-1"/>
        </button>
          <h2 className='mt-6'>{`${itemName}을(를) 삭제하시겠습니까?`}</h2>
          <div className="modalFooter space-x-2 flex flex-row items-center justify-center">
            <button className="confirmButton" onClick={onConfirm}>예</button>
            <button className="cancelButton" onClick={onClose}>아니오</button>
          </div>
        </div>
  
        <style jsx>{`
          .modalOverlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
          }
  
          .modalContent {
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            width: 450px;
            text-align: center;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
          }
  
          .modalFooter {
            margin-top: 20px;
          }
  
          .confirmButton, .cancelButton {
            padding: 10px 20px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
          }
  
          .confirmButton {
            background-color: #f87171;
            color: white;
          }
  
          .cancelButton {
            background-color: #9ca3af;
            color: white;
          }
        `}</style>
      </div>
    );
  };
  
  export default ConfirmDeleteModal;
  