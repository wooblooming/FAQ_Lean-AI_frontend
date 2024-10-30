// components/EditableField.js

import React from 'react';
import EditRoundedIcon from '@mui/icons-material/EditRounded';

const StoreInfoEdit = ({ label, value, onEdit, elementId }) => (
  <div className="flex flex-row items-center text-center font-sans w-screen">
    <div className="flex flex-row items-center text-start">
      <p className="whitespace-pre font-semibold text-xl " onClick={() => onEdit(elementId)} style={{ fontFamily: "NanumSquareBold" }}>
        {label} :&nbsp;
      </p>
      <p className="whitespace-pre hover:underline hover:text-indigo-400 cursor-pointer w-full" onClick={() => onEdit(elementId)} >
        {value}
      </p>
    </div>
    <button
      onClick={() => onEdit(elementId)}
      className="ml-2 text-gray-500"
    >
      <EditRoundedIcon className='text-indigo-500 w-4 h-4' />
    </button>
  </div>
);

export default StoreInfoEdit;
