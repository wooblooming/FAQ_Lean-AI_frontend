import React from 'react';
import { X } from 'lucide-react';

const BusinessTypeModal = ({ isOpen, onClose, currentValue, onSave, businessTypes }) => {
  const [selectedValue, setSelectedValue] = React.useState(currentValue || '');

  const handleSave = () => {
    onSave(selectedValue);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      id="businessTypeModal"
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <div className="modal-content bg-white p-6 rounded-lg shadow-lg text-center"
        style={{ width: '380px', position: 'relative' }}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 z-10"
          aria-label="Close"
        >
          <X className="bg-indigo-500 rounded-full text-white p-1" />
        </button>
        <h2 className="text-2xl font-bold mb-4">비즈니스 종류 수정</h2>
        <select
          className="w-full h-12 p-2 border border-gray-300 rounded"
          value={selectedValue}
          onChange={(e) => setSelectedValue(e.target.value)}
        >
          <option value="">비즈니스 종류 선택</option>
          {Object.entries(businessTypes).map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </select>
        <div className="flex flex-row mt-4">
          <button
            onClick={handleSave}
            className="block w-full py-2 text-blue-400 rounded"
          >
            확인
          </button>
          <button
            onClick={onClose}
            className="block w-full py-2 text-red-400 rounded"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusinessTypeModal;
