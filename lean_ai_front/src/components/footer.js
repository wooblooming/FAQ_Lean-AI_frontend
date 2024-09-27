import React from 'react';

const Footer = () => {
    return (
        <footer className='bg-black text-gray-400 text-xs font-sans p-4 w-full flex justify-center items-center mt-8 hidden md:block'>
            <div className="container">
                <div className="grid grid-cols-2 md:grid-cols-3 ">
                    <div className="grid grid-rows-2">
                        <h3 className="text-2xl sm:text-xl font-bold mb-4 whitespace-nowrap mt-2">
                            (주)린에이아이
                            <p className="text-base sm:text-xs font-normal sm:whitespace-pre-line ">서울특별시 관악구 봉천로 545, 2층(서울창업센터 관악) </p>
                        </h3>
                    </div>

                    <div className="ml-auto">
                        <h4 className="text-base font-semibold mb-2">문의하기</h4>
                        <p className="text-gray-400 text-sm">ch@lean-ai.com</p>
                        <p className="text-gray-400 text-sm">02-6951-1510</p>
                    </div>
                </div>
                <div className="mt-8 pt-4 text-center">
                    {/* 이 부분을 text-center로 감쌌습니다 */}
                    <p>&copy; 2024 (주)린에이아이. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
