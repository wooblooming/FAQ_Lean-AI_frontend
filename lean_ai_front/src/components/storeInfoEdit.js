// components/EditableField.js

import React from 'react';
import EditIcon from './editIcon';

const StoreInfoEdit = ({ label, value, onEdit, elementId }) => (
  <div className="flex flex-row items-start text-center mb-4">
    <div className="flex flex-row items-start text-start">
      <p className="whitespace-pre font-semibold " onClick={() => onEdit(elementId)}>
        {label} :&nbsp;
      </p>
      <p className="whitespace-pre hover:underline hover:text-indigo-400 cursor-pointer" onClick={() => onEdit(elementId)}> {value}</p>
    </div>
    <button
      onClick={() => onEdit(elementId)}
      className="ml-2 text-gray-500"
    >
      <EditIcon style={{ width: '20px', height: '20px' }} />
    </button>
  </div>
);

export default StoreInfoEdit;
