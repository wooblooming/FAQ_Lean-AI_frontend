import React, { useState } from 'react';
import Link from 'next/link';

const NoticePage = () => {
  const [showMessage, setShowMessage] = useState(false);

  const handleButtonClick = () => {
    setShowMessage(prevState => !prevState);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* 상단 네비게이션 바 */}
      <nav className="flex items-center mb-4">
        {/* 뒤로가기 버튼 */}
        <Link href="/mainPageForPresident" className="absolute top-4 left-4 text-gray-500 focus:outline-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </Link>
        <h1 className="text-xl font-bold ml-12">공지사항</h1>
      </nav>

        {/* 알림 전체 */}
        <div className="mb-4">
          <button className="text-lg font-semibold text-left mt-2">알림 전체</button>
        </div>

        {/* 공지사항 섹션 */}
        <div
          className="bg-gray-200 rounded-lg shadow-md p-4 flex items-center cursor-pointer"
          onClick={handleButtonClick}
        >
          <div className="bg-red-400 text-white text-lg font-bold w-10 h-10 rounded-full flex items-center justify-center mr-4">
            L
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold">MUMUL 1.0 출시 안내</h2>
            <p className="text-sm text-gray-500">신규 버전 출시</p>
          </div>
          <div className="text-sm text-gray-400">2024.08.23</div>
        </div>

        {/* 메시지 표시 */}
        {showMessage && (
          <div className="mt-4 p-4 bg-gray-200 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-2">MUMUL 1.0 출시 안내</h2>
            <p className="text-gray-700">
              안녕하세요.
              <br /><br />
              LEAN-AI 입니다.
              <br /><br />
              저희는 여러분께 혁신적인 AI 솔루션을 제공하기 위해 <strong>신규 웹 어플리케이션</strong>을 런칭하게 되었습니다. 이번 어플리케이션은 사용자 여러분이 더 쉽게, 더 빠르게, 그리고 더 정확하게 데이터를 활용할 수 있도록 설계되었습니다.
              <br /><br />
              저희 팀은 이 프로젝트를 통해 여러분의 비즈니스와 일상에 실질적인 가치를 더할 수 있기를 기대하며, 앞으로도 지속적으로 발전해 나갈 것을 약속드립니다.
              <br /><br />
              처음으로 선보이는 만큼, 많은 관심과 피드백 부탁드리며, 여러분의 의견을 반영하여 더욱 완성도 높은 서비스를 제공할 수 있도록 노력하겠습니다.
              <br /><br />
              앞으로도 많은 성원과 격려 부탁드립니다.
              <br /><br />
              감사합니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoticePage;
