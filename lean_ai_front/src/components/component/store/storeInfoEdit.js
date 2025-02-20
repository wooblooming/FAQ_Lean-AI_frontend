// components/EditableField.js

import React from 'react';
import EditRoundedIcon from '@mui/icons-material/EditRounded';

const StoreInfoEdit = ({ label, value, onEdit, elementId }) => {
  // elementId가 "opening_hours"일 경우, value를 줄바꿈 처리
  const formattedValue = elementId === 'opening_hours'
    ? value.split(',').join('\n') // , 기준으로 줄바꿈 처리
    : value;
    
  return (
    <div className="flex flex-row space-x-2 items-start text-center font-sans">
      <div className="flex flex-row items-start text-start">
        <p 
          className="whitespace-pre font-semibold text-xl" 
          onClick={() => onEdit(elementId)} 
          style={{ fontFamily: "NanumSquareBold" }}
        >
          {label} :&nbsp;
        </p>
        <p 
          className="whitespace-pre-line hover:underline hover:text-indigo-400 cursor-pointer" 
          onClick={() => onEdit(elementId)}
        >
          {formattedValue}
        </p>
      </div>
      <EditRoundedIcon 
        className='text-indigo-500 w-4 h-4 cursor-pointer items-start' 
        onClick={() => onEdit(elementId)}
      />
    </div>
  );
};

export default StoreInfoEdit;
