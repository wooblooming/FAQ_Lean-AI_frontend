import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { ChevronLeft } from 'react-feather';
import news from '/public/text/news.json' // 뉴스 데이터

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
      <h3 className="text-black text-xl font-bold mb-2 h-10 md:h-16 truncate">{title}</h3>
      <p className="text-gray-600 md:h-28 line-clamp-2">{content}...</p>
      <div className="text-gray-600 text-sm my-4">{date}</div>
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
      <div className="bg-white rounded-lg p-4 shadow-xl" style={{minWidth:'95%'}}>
        {/* 헤더 및 뒤로가기 버튼 */}
        <div className='flex flex-row'>
          <ChevronLeft
            className="h-8 w-8 text-indigo-700 cursor-pointer mr-2"
            onClick={() => router.back()}
          />
          <h1 className="text-3xl md:text-4xl font-bold text-left text-indigo-600 mb-4"> 회사소식 </h1>
        </div>

        {/* 필터 버튼 */}
        <motion.div
          className="flex justify-center space-x-2 md:space-x-4 mb-6 md:mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3}}
        >
          {filters.map((filter) => (
            <button
              key={filter}
              className={`px-4 md:px-6 py-2 rounded-full transition duration-300 whitespace-nowrap ${activeFilter === filter
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
