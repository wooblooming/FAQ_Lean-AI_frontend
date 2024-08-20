import React, { useState } from 'react';
import Link from 'next/link';

const QnA = () => {
  const [openFAQ, setOpenFAQ] = useState(null);

  // FAQ를 토글하는 함수
  const toggleFAQ = (faqNumber) => {
    setOpenFAQ(openFAQ === faqNumber ? null : faqNumber);
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="max-w-lg mx-auto bg-white border p-5 rounded-lg shadow-lg font-sans mt-4 mb-2 w-10/12 "
        style={{ minHeight: '550px' }}
      >
        <nav className="flex items-center mb-4">
          {/* 뒤로가기 버튼과 제목 배치 */}
          <div className="flex items-center mb-4">
            <Link href="/mainPageForPresident" className="text-gray-500 focus:outline-none mr-2">
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
            <h1 className="text-xl font-bold text-centerx">자주 묻는 질문</h1>
          </div>
        </nav>

        {/* FAQ 질문 1 */}
        <div className="mb-4">
          <button
            className="w-full text-left font-semibold py-2 px-4 bg-gray-200 rounded-lg focus:outline-none"
            onClick={() => toggleFAQ(1)}
          >
            Q1. FAQ 챗봇이 무엇인가요?
            <span
              id="arrow-1"
              className={`float-right transform ${openFAQ === 1 ? 'rotate-180' : ''
                }`}
            >
              ▼
            </span>
          </button>
          <div
            id="answer-1"
            className={`text-sm bg-gray-50 p-4 rounded-lg mt-2 ${openFAQ === 1 ? '' : 'hidden'
              }`}
          >
            챗봇을 통해 소비자에게 업장에서 발생할 수 있는 모든 정보를
            제공하는 AI 서비스 입니다.
          </div>
        </div>

        {/* FAQ 질문 2 */}
        <div className="mb-4">
          <button
            className="w-full text-left font-semibold py-2 px-4 bg-gray-200 rounded-lg focus:outline-none"
            onClick={() => toggleFAQ(2)}
          >
            Q2. FAQ 데이터는 어떻게 넣어요?
            <span
              id="arrow-2"
              className={`float-right transform ${openFAQ === 2 ? 'rotate-180' : ''
                }`}
            >
              ▼
            </span>
          </button>
          <div
            id="answer-2"
            className={`text-sm bg-gray-50 p-4 rounded-lg mt-2 ${openFAQ === 2 ? '' : 'hidden'
              }`}
          >
            메인 페이지에 있는 FAQ 데이터 등록 버튼을 클릭하시면 데이터를 넣을
            수 있는 페이지로 이동합니다.데이터를 넣으신다음 MUMUL에서 확인한 후 수정사항을
            반영해드립니다.
          </div>
        </div>

        {/* FAQ 질문 3 */}
        <div className="mb-4">
          <button
            className="w-full text-left font-semibold py-2 px-4 bg-gray-200 rounded-lg focus:outline-none"
            onClick={() => toggleFAQ(3)}
          >
            Q3. 매장 정보를 수정하고 싶어요!
            <span
              id="arrow-3"
              className={`float-right transform ${openFAQ === 3 ? 'rotate-180' : ''
                }`}
            >
              ▼
            </span>
          </button>
          <div
            id="answer-3"
            className={`text-sm bg-gray-50 p-4 rounded-lg mt-2 ${openFAQ === 3 ? '' : 'hidden'
              }`}
          >
            매장 정보를 수정하려면 관리자 페이지에서
            직접 수정할 수 있습니다.
          </div>
        </div>

        {/* FAQ 질문 4 */}
        <div className="mb-4">
          <button
            className="w-full text-left font-semibold py-2 px-4 bg-gray-200 rounded-lg focus:outline-none"
            onClick={() => toggleFAQ(4)}
          >
            Q4. 서비스 관련해 문의하고 싶어요
            <span
              id="arrow-4"
              className={`float-right transform ${openFAQ === 4 ? 'rotate-180' : ''
                }`}
            >
              ▼
            </span>
          </button>
          <div
            id="answer-4"
            className={`text-sm bg-gray-50 p-4 rounded-lg mt-2 ${openFAQ === 4 ? '' : 'hidden'
              }`}
          >
            서비스 관련 문의는 담당자 이메일(ch@lean-ai.com)로 연락해 주시면
            됩니다.
          </div>
        </div>
      </div>
    </div>
  );
};

export default QnA;
