import React from 'react';
import { X } from 'lucide-react';
import PropTypes from 'prop-types';

const Modal = ({ children, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20"> {/* z-40에서 z-20으로 변경 */}
      <div
        className="bg-white rounded-lg relative"
        style={{ width: '95%', maxWidth: '400px', height: '95%', maxHeight: '675px' }} // 모달의 크기 조정
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
