import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { ArrowLeft } from 'react-feather';

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
    title: `린에이아이, 한국MS·중기부 '마중 프로그램' 선정`,
    date: '2024-09-24',
    content: `인공지능(AI) 전문 스타트업 린에이아이(대표 김하연, 옛 잡쇼퍼)가 한국마이크로소프트(MS)와 중소벤처기업부가 공동으로 진행하는 '마중 프로그램 5기'에 최종 선정됐다고 24일 밝혔다.`,
    link: 'https://www.etnews.com/20240924000231'
  },

];

const NewsCard = ({ category, title, date, content, link }) => (
  <motion.div
    className="bg-gray-800 rounded-lg shadow-lg overflow-hidden"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
  >
    <div className="bg-purple-700 py-2 px-4">
      <span className="text-white text-sm font-semibold">{category}</span>
    </div>
    <div className="p-6">
      <h3 className="text-white text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-300 mb-4">{content.substring(0, 100)}...</p>
      <div className="text-purple-400 text-sm mb-4">{date}</div>
      <a
        href={link}
        className="inline-block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition duration-300"
        target="_blank"
        rel="noopener noreferrer"
      >
        더 보기
      </a>
    </div>
  </motion.div>
);


const Newsroom = () => {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('전체');
  const [currentPage, setCurrentPage] = useState(1);
  const filters = ['전체', '회사 뉴스', '보도자료'];
  const itemsPerPage = 6;
  const filteredNews = activeFilter === '전체' ? news : news.filter(item => item.category === activeFilter);
  const pageCount = Math.ceil(filteredNews.length / itemsPerPage);
  const displayedNews = filteredNews.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="bg-gray-900 min-h-screen p-8 text-white">
      <div className="max-w-6xl mx-auto">
        <ArrowLeft
          className="h-8 w-8 text-indigo-700 cursor-pointer mr-2"
          onClick={() => router.back()}
        />

        <motion.h1
          className="text-4xl font-bold text-center text-purple-400 mb-2"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          뉴스룸
        </motion.h1>
        <motion.h2
          className="text-2xl font-semibold text-center text-gray-300 mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          (주)린에이아이의 최신 소식을<br />
          가장 신속하게 제공합니다.
        </motion.h2>

        {/* 필터 버튼 */}
        <motion.div
          className="flex justify-center space-x-4 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {filters.map((filter) => (
            <button
              key={filter}
              className={`px-6 py-2 rounded-full transition duration-300 ${activeFilter === filter
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedNews.map((item, index) => (
            <NewsCard key={index} {...item} />
          ))}
        </div>

        {/* 페이지네이션 */}
        <div className="flex justify-center mt-12 space-x-2">
          {Array.from({ length: pageCount }, (_, i) => (
            <button
              key={i}
              className={`px-4 py-2 rounded ${currentPage === i + 1
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
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