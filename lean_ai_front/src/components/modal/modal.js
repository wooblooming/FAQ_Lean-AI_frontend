import React from 'react';
import { X } from 'lucide-react';
import PropTypes from 'prop-types';

const Modal = ({ children, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20"> 
      <div
        className="bg-white rounded-lg relative w-[95%] h-[90%] md:min-w-[400px] md:max-w-[30%]"     
      >
        <button
          onClick={onClose}
          className='absolute top-4 right-4 z-20'
          style={{ cursor: 'pointer' }}
          aria-label="Close"
        >
          <X className="bg-indigo-500 rounded-full text-white p-1"/>
        </button>

        <div className="w-full h-full overflow-y-auto scroll-auto"> {/* 모달의 내부 */}
          {children}
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Modal;
