import React from 'react';
import { X } from 'lucide-react';

const AllergyModal = ({ show, onClose, menuDetails }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-md mx-auto relative">
        <h2 className="text-xl font-bold mb-4">알레르기 정보</h2>
        <button
          onClick={onClose}
          className=" "
          style={{ cursor: 'pointer' }}
          aria-label="Close"
        >
          <X className="absolute top-4 right-4 bg-indigo-500 rounded-full text-white z-20 p-1"/>
        </button>
        <div className="overflow-y-auto max-h-96">
          {menuDetails && menuDetails.length > 0 ? (
            menuDetails.map((menu, index) => (
              <div key={index} className="mb-4">
                <h3 className="font-semibold">{menu.name}</h3>
                <p>{menu.allergy ? `알레르기 정보: ${menu.allergy}` : '알레르기 정보 없음'}</p>
              </div>
            ))
          ) : (
            <p>알레르기 정보가 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllergyModal;
