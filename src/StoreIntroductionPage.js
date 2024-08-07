// src/StoreIntroductionPage.js
import React from 'react';
import { Link } from 'react-router-dom';

const StoreIntroductionPage = () => {
  return (
    <div className="bg-white flex flex-col items-center min-h-screen overflow-y-auto relative">
      <div className="bg-white rounded-lg p-8 w-full max-w-md text-center mb-2">
        <img src="your-image.png" alt="Store" className="mx-auto mb-4 w-64 h-52 object-contain" />
        <p className="font-bold text-2xl">찬혁 떡볶이</p>
      </div>
      <div className="bg-slate-200 flex flex-col items-center text-center mb-4 w-64 px-2">
        <p className="mt-4 mb-4 text-xl">영업 시간 : 9:00 ~ 18:00 <br /> 위치 : 서울특별시</p>
      </div>
      <div className="bg-slate-200 flex flex-col items-center text-center w-64 px-2">
        <p className="mt-4 mb-4 mb-4 text-xl">메뉴 및 가격 <br />
          매운 떡볶이 : 3000원 <br />
          로제 떡볶이 : 5000원 <br />
          마라 떡볶이 : 5000원 <br />
          날치알 주먹밥 : 2500원 <br />
          각 종 튀김 : 700원 <br />
        </p>
      </div>
      <Link to="/chatbot">
        <img src="chatbot.png" alt="Chatbot" className="fixed-bottom-right w-24 h-24 object-cover" />
      </Link>
    </div>
  );
};

export default StoreIntroductionPage;
