import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { ChevronLeft } from 'react-feather';

// 뉴스 데이터를 외부에서 사용할 수 있도록 내보내기
export const news = [
  {
    id: 1,
    category: '보도자료',
    title: '린에이아이-동아사이언스, 과학/수학 교육 AI DT 사업 위한 업무협약 체결',
    date: '2024-08-14',
    content: '교육/지식 특화 sLLM(smaller Large Language Model) 플랫폼 기업 린에이아이(대표 김하연)와 과학 전문 미디어기업 동아사이언스(대표 장경애)가 과학/수학 교육 AI DT 사업을 위한 업무협약(MOU)을 체결했다.',
    link: 'https://www.thebigdata.co.kr/view.php?ud=2024081317185739339aeda69934_23'
  },
  {
    id: 2,
    category: '보도자료',
    title: `AI기술 활용 소상공인 업무 디지털 혁신 지원 '린에이아이'`,
    date: '2024-09-03',
    content: `▶ 창업하게 된 이유와 기업소개 그리고 앞으로 기업 운영 계획은? 
▷‘린에이아이’는 창업 7년차 스타트업입니다. AI 기술로 지역·소득에 따른 교육 기회의 격차를 해소하고자 ‘잡쇼퍼’라는 회사명으로 창업한 기업입니다.`,
    link: 'https://xn--zb0b20fnzw5rc.kr/sub_read.html?uid=18862&section=sc4&section2=%EB%8B%A8%EC%B2%B4%EC%86%8C%EC%8B%9D'
  },
  {
    id: 3,
    category: '보도자료',
    title: `린에이아이, 한국MS·중기부 '마중 프로그램' 선정`,
    date: '2024-09-24',
    content: `인공지능(AI) 전문 스타트업 린에이아이(대표 김하연, 옛 잡쇼퍼)가 한국마이크로소프트(MS)와 중소벤처기업부가 공동으로 진행하는 '마중 프로그램 5기'에 최종 선정됐다고 24일 밝혔다.`,
    link: 'https://www.etnews.com/20240924000231'
  },
  {
    id: 4,
    category: '보도자료',
    title: `“소상공인을 위한 맞춤형 AI서비스 만들어드려요”···린에이아이의 착한 디지털 혁신`,
    date: '2024-12-16',
    content: `소상공인들의 업무 디지털 혁신을 도와 경쟁력 높여 맞춤형 AI 활용해 직원들 잡무 줄이고 만족도· 효율성 up AI챗봇 ‘무물(MUMUL)’, 소상공인 위한 ‘무엇이든 물어보세요’`,
    link: 'https://www.mk.co.kr/news/economy/11195419'
  },
];

// 뉴스 카드 컴포넌트
const NewsCard = ({ category, title, date, content, onClick }) => (
  <motion.div
    className="bg-indigo-100 rounded-lg shadow-lg overflow-hidden cursor-pointer"
    onClick={onClick}
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.7, delay: 0.5}}
  >
    <div className="bg-indigo-600 py-2 px-4">
      <span className="text-white text-lg font-semibold">{category}</span>
    </div>
    <div className="p-6">
      <h3 className="text-black text-xl font-bold mb-2 h-16">{title}</h3>
      <p className="text-gray-600 h-24">{content}...</p>
      <div className="text-gray-600 text-sm mb-4">{date}</div>
    </div>
  </motion.div>
);

const Newsroom = () => {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('전체'); // 필터 상태
  const [currentPage, setCurrentPage] = useState(1); // 페이지 상태
  const filters = ['전체', '회사뉴스', '보도자료']; // 필터 옵션
  const itemsPerPage = 4; // 페이지당 항목 수
  // 정렬된 news 데이터를 사용하기 위해 slice()로 원본 배열 변경 방지
  const filteredNews = [...(activeFilter === '전체' ? news : news.filter(item => item.category === activeFilter))]
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  const pageCount = Math.ceil(filteredNews.length / itemsPerPage); // 페이지 수 계산
  const displayedNews = filteredNews.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);


  return (
    <div className="bg-violet-50 min-h-screen p-8 text-indigo-600 flex items-center justify-center">
      <div className="max-w-6xl bg-white rounded-lg p-4" style={{ minWidth: '1150px', minHeight: '700px' }}>
        {/* 헤더 및 뒤로가기 버튼 */}
        <div className='flex flex-row'>
          <ChevronLeft
            className="h-8 w-8 text-indigo-700 cursor-pointer mr-2"
            onClick={() => router.back()}
          />
          <h1 className="text-4xl font-bold text-left text-indigo-600 mb-4"> 회사소식 </h1>
        </div>

        {/* 필터 버튼 */}
        <motion.div
          className="flex justify-center space-x-4 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3}}
        >
          {filters.map((filter) => (
            <button
              key={filter}
              className={`px-6 py-2 rounded-full transition duration-300 whitespace-nowrap ${activeFilter === filter
                ? 'bg-indigo-500 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:ring-2 ring-indigo-500'
                }`}
              onClick={() => {
                setActiveFilter(filter);
                setCurrentPage(1);
              }}
            >
              {filter}
            </button>
          ))}
        </motion.div>

        {/* 뉴스 카드 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {displayedNews.map((item, index) => (
            <NewsCard key={item.id} {...item} onClick={() => window.open(item.link, '_blank')} />
          ))}
        </div>

        {/* 페이지네이션 */}
        <div className="flex justify-center mt-12 space-x-2">
          {Array.from({ length: pageCount }, (_, i) => (
            <button
              key={i}
              className={`px-4 py-2 rounded ${currentPage === i + 1
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-600 hover:ring-2 ring-indigo-500'
                }`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Newsroom;
