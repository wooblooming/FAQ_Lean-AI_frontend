import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const timelineData = [
  {
    year: 2020,
    events: [
      { 
        date: '2020.10', 
        title: '2020 4IR 어워즈 AI부문 대상', 
        description: '4차 산업혁명 관련 기술 혁신 성과 인정',
        details: '인공지능 기술의 혁신적인 적용으로 산업 전반의 효율성 향상에 기여한 점을 높이 평가받아 수상하였습니다.',
        image: '/images/reward1.png'
      },
      { 
        date: '2020.09', 
        title: 'AI 데이터가공 바우처지원사업 선정', 
        description: 'AI 기술 발전을 위한 정부 지원 획득',
        details: '중소벤처기업부의 AI 데이터 가공 지원 사업에 선정되어 AI 기술 발전을 위한 데이터 가공 프로젝트를 수행하게 되었습니다.',
      },
    ],
  },
  {
    year: 2019,
    events: [
      { 
          date: '2019.12', 
          title: '제 3회 서울혁신챌린지 최우수상', 
          description: '4차 산업혁명 관련 기술 혁신 성과 인정',
          details: '인공지능 기술의 혁신적 적용으로 산업 전반의 효율성 향상에 기여한 점을 높이 평가받아 수상하였습니다.',
          image: '/images/reward2.jpg'
        },
        { 
          date: '2019.11', 
          title: '고려대 소셜벤처 발굴 프로젝트 우수상', 
        },
        { 
            date: '2019.08', 
            title: 'AI-Tech 기업 인증', 
          },
          { 
            date: '2019.08', 
            title: '2019 안암동 캠퍼스타운 창업경진대회 금상', 
          },
          { 
            date: '2019.07', 
            title: '2019 산업지능화 스타트업 창업경진대회 우수상', 
          },
          { 
            date: '2019.06', 
            title: '기보벤처캠프 4기 우수기업 선정', 
          },
          { 
            date: '2019.06', 
            title: '2019년 SW마에스트로 수료생 창업지원사업 선정', 
          },
          { 
            date: '2019.05', 
            title: '벤처기업 인증', 
          },
          { 
            date: '2019.04', 
            title: '기업부설연구소 설립', 
          },
        ],
    },
    {
      year: 2018,
      events: [
        { 
            date: '2018.12', 
            title: '2018년 고려대 SW중심대학 창업경진대회 최우수상', 
          },
          { 
            date: '2018.11', 
            title: 'SW시장성 테스트 지원사업 정보통산업흥원 장상', 
          },
          { 
            date: '2018.09', 
            title: '빅데이터 기반 학과 종합 정보 서비스 메이저맵 베타버전 런칭', 
          },
          { 
            date: '2018.07', 
            title: 'H-온드림 7기 선정', 
          },
          { 
            date: '2018.06', 
            title: '성신여대 창업선도대학 지원팀 선정 (신기술 부문)', 
          },
          { 
            date: '2018.02', 
            title: '서울창업디딤터 2018년 PRE-BI 입주기업 선발)', 
          },
        ],
    },
    {
      year: 2017,
      events: [
        { 
            date: '2017.11', 
            title: 'SK플래닛 101 Startup Korea 7기 선정', 
          },
          { 
            date: '2017.11', 
            title: '2017 대학 창업유망팀 300 시제품 전시회 부총리겸 교육부 장관상', 
          },
          { 
            date: '2017.10', 
            title: '2017 고려대 크라우드펀딩 경진대회 장려상', 
          },
          { 
            date: '2017.10', 
            title: '2017년 대학 창업유망팀 100 최종선발', 
          },
          { 
            date: '2017.09', 
            title: '미래에셋대우 청년창업지원 프로젝트 최우수상', 
          },
          {
            date: '2017.08',
            title: '인공지능 기반 진로 큐레이션 서비스 잡쇼퍼 런칭',
          },
          {
            date: '2017.08',
            title: 'KU Lean Innovation Challenge&Startup 경진대회 Lean Startup상',
          },
          {
            date: '2017.05',
            title: '주식회사 잡쇼퍼 법인 설립',
          },
          {
            date: '2017.04',
            title: '2017년 과학기술기반 창업중심대학 지원팀 선정(과기부)',
          },
          {
            date: '2017.03',
            title: '2016년 2학기 SK청년비상 창업지원사업 우수팀 선정',
          },
        ],
    },
    {
      year: 2016,
      events: [
        { 
            date: '2016.12', 
            title: '제1회 고려대 모의크라우드펀딩 경진대회 장려상', 
          },
          { 
            date: '2016.12', 
            title: '제1회7회 KU Campu&RnD CEO 경진대회 최우수상', 
          },
          { 
            date: '2016.12', 
            title: '2017 사회적기업가 육성사업 사전선발', 
          },
          { 
            date: '2016.09', 
            title: '2016년 2학기 SK청년비상 창업지원사업 선정', 
          },
      ],
    },
];

const TimelineEvent = ({ date, title, description }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className=" flex items-center space-x-16 group relative transition-all duration-1000 ease-out"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex-shrink-0 font-medium text-gray-700 px-2">{date}</div>
      <div className="w-full flex-grow py-2">
        <h3
          className={`font-bold text-xl transition-all duration-300 ease-in-out ${
            isHovered ? 'text-indigo-500 scale-105' : 'text-black'
          }`}
        >
          {title}
        </h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
};

const YearMarker = ({ year, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer my-3 flex items-center transition-all duration-300 ease-in-out"
    >
      <div className="flex-shrink-0 w-24 font-bold text-3xl text-indigo-500">{year}</div>
      <div className={'w-full border-b-2 flex-grow ml-4 transition-all duration-300 border-indigo-300'}></div>
    </div>
  );
};

const Timeline = () => {
  const [openYears, setOpenYears] = useState({});
  const router = useRouter();

  const toggleYear = (year) => {
    setOpenYears((prevOpenYears) => ({
      ...prevOpenYears,
      [year]: !prevOpenYears[year],
    }));
  };

  return (
    <div className="min-h-screen p-4 font-sans bg-violet-50">
      <div
        className="max-w-4xl mx-auto py-12 px-6 shadow-md rounded-lg bg-white"
        style={{borderRadius: '50px 0 50px 0' }}
      >
        <div className="flex items-center mb-12">
          <ArrowLeft
            className="h-8 w-8 text-indigo-700 cursor-pointer mr-2"
            onClick={() => router.push('/')}
          />
          <h1 className="text-4xl font-bold text-center">린에이아이의 걸어온 길</h1>
        </div>
        <div className="max-w-3xl mx-auto">
          {timelineData.map((yearData) => (
            <React.Fragment key={yearData.year}>
              <YearMarker
                year={yearData.year}
                onClick={() => toggleYear(yearData.year)}
                isOpen={!!openYears[yearData.year]}
              />
              <AnimatePresence>
                {openYears[yearData.year] && (
                  <motion.div
                    key={yearData.year}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    style={{ overflow: 'hidden' }}
                  >
                    {yearData.events.map((event, index) => (
                      <TimelineEvent key={index} {...event} />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Timeline;
