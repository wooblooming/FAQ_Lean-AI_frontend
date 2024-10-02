import React, { useState, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // FontAwesomeIcon 가져오기
import { faCommentDots } from '@fortawesome/free-solid-svg-icons'; // 필요한 아이콘 가져오기

const ServiceSection = ({ isMobile }) => {

  return (
    <div className='flex flex-col space-y-2'>
      <p 
        className='text-center font-semibold' style={{fontSize:'40px'}}
      >
        <span className='text-indigo-600'>MUMUL</span>은 무엇을 할 수 있을까요?
      </p>
      <div className='flex flex-row space-x-2'>
        <div className='flex flex-col space-y-1 '>
          <FontAwesomeIcon icon={faCommentDots} className='text-indigo-300'/>
          <p className='text-gray-700'>고객 문의에 적합한 커맨드 추천</p>
        </div>
      </div>
    </div>
  );
};


export default ServiceSection;
