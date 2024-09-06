import React, { useState } from 'react';
import Link from 'next/link';

const NoticePage = () => {
  const [selectedNotice, setSelectedNotice] = useState(null);

  // 공지사항을 jSON 형태로 작성
  const notices = [
    {
      id: 1,
      title: "MUMUL 1.0 출시 안내",
      date: "2024.08.28",
      description: "신규 버전 출시",
      image: "Lean-ai admin.png",
      content: (
        <>
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
        </>
      ),
    },
    {
      id: 2,
      title: "데이터 입력 양식",
      date: "2024.08.28",
      description: "FAQ 데이터 입력 양식 및 가이드라인",
      image: "Lean-ai admin.png",
      content: (
        <>
          안녕하세요. Lean_AI입니다.
          <br /><br />
          FAQ에 대한 데이터 입력 양식과 가이드라인을 첨부하여 안내드립니다.
          <br /><br />
          데이터를 제출하실 때, 빠른 데이터 입력과 보다 정확하고 일관된 정보를 제공하기 위해, 저희가 제공한 양식을 따라 주시기를 부탁드립니다.
          <br /><br />
          제출 과정에서 궁금한 사항이 있거나 추가적인 도움이 필요하시면 언제든지 문의해 주시기 바랍니다.
          <br /><br />
          감사합니다.
          <br /><br />
          <a
            href="/mumul service data guideline.xlsx"
            download="mumul service data guideline.xlsx"
            className="text-blue-500 underline"
          >
            데이터 입력 양식 및 가이드라인 다운로드
          </a>
        </>
      ),
    },
  ];

  // 선택한 공지사항의 상세 내용 확인
  const handleButtonClick = (id) => {
    setSelectedNotice(prevSelected => (prevSelected === id ? null : id));
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="max-w-lg mx-auto bg-white border p-4 rounded-lg shadow-lg font-sans mt-4 mb-2 w-10/12"
        style={{ minHeight: '550px' }}
      >
        <nav className="flex items-center mb-4">
          <Link href="/mainPageForPresident" className="text-gray-600">
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

        <div className="mb-4">
          <button className="text-lg font-semibold text-left mt-2">알림 전체</button>
        </div>

        {notices.map(notice => (
          <div key={notice.id}>
            <div
              className="bg-gray-200 rounded-lg shadow-md p-2 flex items-center cursor-pointer mb-3"
              onClick={() => handleButtonClick(notice.id)}
            >
              <img src={notice.image} className="w-7 h-7 items-center justify-center mr-4" alt="Notice" />
              <div className="flex-1">
                <h2 className="text-lg font-semibold whitespace-nowrap">{notice.title}</h2>
                <p className="text-sm text-gray-500 whitespace-nowrap">{notice.description}</p>
                <div className="text-sm text-gray-400 whitespace-nowrap">{notice.date}</div>
              </div>
              
            </div>

            {selectedNotice === notice.id && (
              <div className="mt-2 p-4 bg-gray-100 rounded-lg mb-4">
                <h2 className="text-lg font-bold mb-2">{notice.title}</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {notice.content}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NoticePage;
