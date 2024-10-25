import React, { useState, useContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/router';
import { HistoryContext, HistoryProvider } from '../contexts/historyContext';
import { AwardsContext, AwardsProvider } from '../contexts/awardsContext';
import { BussinessContext, BussinessProvider } from '../contexts/bussinessContext';
import { news } from '../pages/news';


// SectionItem 컴포넌트: 각 섹션의 반복적인 렌더링을 처리
const SectionItem = ({ title, content, index, activeSections, toggleSection, isMobile }) => (
  <motion.div
    className="flex-1 rounded-lg overflow-hidden"
    style={{
      transition: 'border 0.3s ease-in-out',
      backgroundColor: activeSections[index] ? '#fff' : '',
    }}
    whileHover={{ scale: 1.03 }}
    initial={{ opacity: 0, y: -50 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <motion.div
      className="p-4 md:px-3 py-6 flex justify-between items-center cursor-pointer bg-indigo-500 rounded-lg"
      style={{
        borderRadius: activeSections[index] ? '8px 8px 0 0' : '',
        color: 'white',
        whiteSpace: 'nowrap',
      }}
      onClick={() => toggleSection(index)}
    >
      <h3 className={`text-lg md:text-2xl font-semibold ${isMobile ? 'text-center' : ''}`}>{title}</h3>
      <motion.div className={`transform transition-transform ${activeSections[index] ? 'rotate-180' : ''}`}>
        <ChevronDown className="h-5 w-5 md:h-6 md:w-6" />
      </motion.div>
    </motion.div>

    <AnimatePresence initial={false}>
      {activeSections[index] && (
        <motion.div
          key={`content-${title}`}
          variants={{ closed: { height: 0, opacity: 0 }, open: { height: 'auto', opacity: 1 } }}
          initial="closed"
          animate="open"
          exit="closed"
          transition={{ duration: 0.3 }}
          className="px-4 md:px-2 py-4 overflow-hidden rounded-lg"
          style={{
            backgroundColor: '#fff',
            borderRadius: '0 0 8px 8px',
          }}
        >
          <ul className="space-y-2">
            {Array.isArray(content) ? (
              // 배열 형태
              content.slice(0, 3).map((item, idx) => (
                <li key={idx} className="flex items-center">
                  <ChevronRight className="mr-1 flex-shrink-0 h-5 w-5 text-indigo-300" />
                  <span className={`${isMobile ? 'text-sm' : 'text-base'}`}>
                    <span className="font-bold">{item.year}</span> {item.content}
                  </span>
                </li>
              ))
            ) : (
              // 문자열 형태
              content.split('\n').slice(0, 3).map((item, idx) => (
                <li key={idx} className="flex items-center">
                  <ChevronRight className="mr-1 flex-shrink-0 h-5 w-5 text-indigo-300" />
                  <span className={`${isMobile ? 'text-sm' : 'text-base'}`}>{item}</span>
                </li>
              ))
            )}
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);
// 데스크탑 UI
const DesktopSection = ({ sectionData, activeSections, toggleSection }) => (
  <motion.div
    className="flex justify-between space-x-4"
    initial={{ opacity: 0, y: -50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
  >
    {sectionData.map((section, index) => (
      <SectionItem
        key={section.title}
        title={section.title}
        content={section.content}
        index={index}
        activeSections={activeSections}
        toggleSection={toggleSection}
        isMobile={false}
      />
    ))}
  </motion.div>
);

// 모바일 UI
const MobileSection = ({ sectionData, activeSections, toggleSection }) => (
  <motion.div
    className="grid grid-cols-1 gap-2"
    initial={{ opacity: 0, y: -50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
  >
    {sectionData.map((section, index) => (
      <SectionItem
        key={section.title}
        title={section.title}
        content={section.content}
        index={index}
        activeSections={activeSections}
        toggleSection={toggleSection}
        isMobile={true}
      />
    ))}
  </motion.div>
);

// 최신 순으로 뉴스 정렬하는 함수
const getLatestNews = () => {
  return [...news]
    .sort((a, b) => new Date(b.date.replace(/-/g, '/')) - new Date(a.date.replace(/-/g, '/'))) // 최신순 정렬
    .slice(0, 3); // 상위 3개의 뉴스만 선택
};

const CompanySection = ({ isMobile }) => {
  const [activeSections, setActiveSections] = useState([false, false, false]);

  // Context로부터 데이터 가져오기
  const historyContent = useContext(HistoryContext);
  const awardsContent = useContext(AwardsContext);
  const bussinessContent = useContext(BussinessContext);
  const latestNews = getLatestNews(); 

  const router = useRouter();

  // 섹션 열림/닫힘 상태를 업데이트하는 함수
  const toggleSection = (index) => {
    setActiveSections((prev) => prev.map((isActive, i) => (i === index ? !isActive : false)));
  };

  // 섹션 데이터 정의
  const sectionData = [
    { title: '연혁', content: historyContent },
    { title: '수상 실적', content: awardsContent },
    { title: '사업화 및 R&D 실적', content: bussinessContent },
  ];

  // 모바일과 데스크탑에서 다른 텍스트를 적용
  const mobileDescription = (
    <div style={{ fontFamily: "NanumSquareExtraBold" }}>
      <p className="font-bold text-3xl mb-2">(주)린에이아이</p>
      <p className="text-gray-700 text-xl  ">
        AI가 필요한 모든 산업, 영역에 <br />
        <span className="text-indigo-700 text-2xl ">린에이아이의 AI 기술</span>
        을 <br />
        적용하고자 합니다.
      </p>
    </div>
  );

  const desktopDescription = (
    <>
      <p className="font-bold mb-6 text-5xl" >(주)린에이아이</p>
      <p className="text-gray-700 text-3xl font-semibold mb-8">
        AI가 필요한 모든 산업, 영역에 <span className="text-indigo-700 text-4xl font-bold">린에이아이의 AI 기술</span>을 적용하고자 합니다.
      </p>
    </>
  );

  return (
    <motion.div
      className="px-4 mx-3 md:px-8 py-8 md:py-12"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container mx-auto">
        {/* 제목 및 설명 */}
        <motion.h2
          className={`mb-4 text-left ${isMobile ? ' p-2' : ''}`}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ fontFamily: "NanumSquareExtraBold" }}
        >
          {isMobile ? mobileDescription : desktopDescription}
        </motion.h2>

        {/* 섹션 리스트: 모바일과 데스크탑 UI를 구분하여 렌더링 */}
        {isMobile ? (
          <MobileSection sectionData={sectionData} activeSections={activeSections} toggleSection={toggleSection} />
        ) : (
          <DesktopSection sectionData={sectionData} activeSections={activeSections} toggleSection={toggleSection} />
        )}

        {/* 하단 버튼 */}
        <motion.div
          className={`flex flex-row justify-end items-center text-indigo-500 font-semibold ${isMobile ? 'mt-4' : 'mt-6'}`}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <button
            onClick={() => router.push('/history')}
            style={{ fontFamily: "NanumSquareBold" }}
            className={` transition-colors hover:text-indigo-700 py-1 ${isMobile ? 'text-lg' : 'text-xl'}`}
          >
            자세히 보기 
          </button>
          <ArrowRight className="ml-1 h-5 w-5 " />
        
        </motion.div>

        <div className="bg-white rounded-lg p-6 mt-4 md:mt-20 space-y-4 text-left w-full md:w-1/2">
          <h2 className="text-3xl text-indigo-600" style={{ fontFamily: 'NanumSquareExtraBold' }}>회사소식</h2>
          <ul className="space-y-4 px-0 md:px-4">
            {latestNews.map((news) => (
              <li 
                key={news.id} 
                className="flex justify-between space-x-2 items-center border-b pb-2 cursor-pointer" 
                onClick={() => router.push(news.link)}
              >
                <h3
                  className="text-lg font-semibold text-black truncate"
                  style={{ maxWidth: '70%' }}
                >
                  {news.title}
                </h3>
                <p className="text-sm text-gray-500 hidden md:block whitespace-nowrap">{news.date}</p>
              </li>
            ))}
          </ul>
          <div className="flex flex-row justify-end items-center text-indigo-500 font-semibold px-2">
            <button className="" onClick={() => router.push('/news')}>
              모든 소식 보기
            </button>
            <ArrowRight className="ml-1 h-4 w-4" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// 전체 Context Provider로 감싸기
const CompanySectionWithProviders = ({ isMobile }) => {
  return (
    <HistoryProvider>
      <AwardsProvider>
        <BussinessProvider>
          <CompanySection isMobile={isMobile} />
        </BussinessProvider>
      </AwardsProvider>
    </HistoryProvider>
  );
};

export default CompanySectionWithProviders;