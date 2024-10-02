import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';


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
  const [isVisible, setIsVisible] = useState(false);
  const eventRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (eventRef.current) {
      observer.observe(eventRef.current);
    }

    return () => {
      if (eventRef.current) {
        observer.unobserve(eventRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={eventRef}
      className={`mb-8 flex items-center group relative transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex-shrink-0 w-24 text-sm font-medium text-gray-500">{date}</div>
      <div className="w-full border-b border-gray-300 flex-grow ml-4 pb-4">
        <h3 
          className={`font-bold text-xl mb-1 transition-all duration-300 ease-in-out ${
            isHovered ? 'text-blue-600 scale-105' : 'text-black'
          }`}
        >
          {title}
        </h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
};

const YearMarker = ({ year }) => {
  const [isVisible, setIsVisible] = useState(false);
  const yearRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (yearRef.current) {
      observer.observe(yearRef.current);
    }

    return () => {
      if (yearRef.current) {
        observer.unobserve(yearRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={yearRef}
      className={`mb-8 flex items-center transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="flex-shrink-0 w-24 font-bold text-2xl text-indigo-900">{year}</div>
      <div className="w-full border-b-2 border-indigo-500 flex-grow ml-4"></div>
    </div>
  );
};

const Timeline = () => {
  const handleGoBack = () => {
    window.history.back(); // 뒤로가기 기능 추가
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl text-center font-bold mb-4 flex justify-center">린에이아이의 걸어온 길</h1> {/* 타이틀 추가 */}
      <Link href="#">  {/* Link에 href 추가 */}
        <a onClick={handleGoBack} className="absolute top-4 left-4 text-gray-500 flex justify-center focus:outline-none"> 
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </a>
      </Link>
      <div className="max-w-3xl mx-auto">
        {timelineData.map((yearData) => (
          <React.Fragment key={yearData.year}>
            <YearMarker year={yearData.year} />
            {yearData.events.map((event, index) => (
              <TimelineEvent key={index} {...event} />
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Timeline;