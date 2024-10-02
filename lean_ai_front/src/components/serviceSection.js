import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots, faCircleQuestion, faTerminal, faHeadset } from '@fortawesome/free-solid-svg-icons';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const ServiceSection = ({ isMobile }) => {
  // 애니메이션 제어를 위한 훅
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1, // 요소가 10% 보일 때 애니메이션 트리거
  });

  // 스크롤 시 애니메이션 제어
  useEffect(() => {
    if (inView) {
      controls.start('visible');
    } else {
      controls.start('hidden');
    }
  }, [controls, inView]);

  // 애니메이션 변형 속성 정의
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.2, // 각 자식 컴포넌트의 애니메이션 딜레이
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.7 }, // 초기 scale 값을 0.9로 지정
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } }, // 애니메이션 시 scale 1로 변경
  };


  // 모바일 버전의 컴포넌트 렌더링
  const renderMobileVersion = () => (
    <motion.div
      className="flex flex-col items-center"
      ref={ref} // 스크롤 감지를 위한 ref
      initial="hidden"
      animate={controls}
      variants={containerVariants}
    >
      <p className="text-center font-semibold mt-2 mb-4 text-3xl ">
        <span className="text-indigo-600">MUMUL 서비스</span>에서는 <br />
        무엇을 할 수 있을까요?
      </p>
      {/* 2x2 레이아웃 설정을 위한 grid 적용 */}
      <div className="grid grid-cols-2 gap-4 whitespace-pre-line">
        {/* 각 아이콘 섹션 */}
        {renderServiceItem(
          `고객 문의에 \n적합한 커맨드 추천`,
          faTerminal,
          'bg-gradient-to-r from-pink-50 to-pink-100',
          true // 모바일 크기
        )}
        {renderServiceItem(
          `자주 묻는 질문 \n답변 매칭`,
          faCircleQuestion,
          'bg-gradient-to-r from-pink-100 to-purple-100',
          true
        )}
        {renderServiceItem(
          `사전학습 기반 \n답변 생성`,
          faCommentDots,
          'bg-gradient-to-r from-purple-100 to-violet-100',
          true
        )}
        {renderServiceItem(
          `고객 문의 \n데이터 아카이빙`,
          faHeadset,
          'bg-gradient-to-r from-violet-100 to-indigo-100',
          true
        )}
      </div>
      <motion.div
        className="-skew-y-3 h-auto mt-8 p-4 flex flex-col text-center text-white shadow-md"
        style={{ backgroundColor: '#FF609E', fontFamily: 'NanumSquareBold', width:'98%' }}
        ref={ref}
        initial="hidden"
      >
        <p style={{ fontFamily: 'NanumSquareExtraBold', fontSize: '35px' }}>
          대충 물어봐도 찰떡같이!
          <br />
          <span style={{ fontFamily: 'NanumSquareBold', fontSize: '25px' }}>
            고객의 문의, 대화의 맥락을 이해해서 <br /> 알맞은 답변을 제공합니다
          </span>
        </p>
      </motion.div>
    </motion.div>
  );

  // 데스크탑 버전의 컴포넌트 렌더링
  const renderDesktopVersion = () => (
    <motion.div
      className="flex flex-col"
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={containerVariants}
    >
      <p className="text-center font-semibold m-8 text-4xl">
        <span className="text-indigo-600">MUMUL 서비스</span>에서는 무엇을 할 수 있을까요?
      </p>
      <div className="flex flex-row items-center justify-center space-x-6">
        {/* 각 아이콘 섹션 */}
        {renderServiceItem(
          '고객 문의에 적합한 커맨드 추천',
          faTerminal,
          'bg-gradient-to-r from-pink-50 to-pink-100',
          false // 데스크탑 크기
        )}
        {renderServiceItem(
          '자주 묻는 질문 답변 매칭',
          faCircleQuestion,
          'bg-gradient-to-r from-pink-100 to-purple-100',
          false
        )}
        {renderServiceItem(
          '사전학습 기반 답변 생성',
          faCommentDots,
          'bg-gradient-to-r from-purple-100 to-violet-100',
          false
        )}
        {renderServiceItem(
          '고객 문의 데이터 아카이빙',
          faHeadset,
          'bg-gradient-to-r from-violet-100 to-indigo-100',
          false
        )}
      </div>
      <motion.div
        className="-skew-y-3 h-auto mt-16 p-4 flex flex-col text-center text-white w-full"
        style={{ backgroundColor: '#FF609E', fontFamily: 'NanumSquareBold' }}
        ref={ref}
        initial="hidden"
      >
        <p style={{ fontFamily: 'NanumSquareExtraBold', fontSize: '40px' }}>
          대충 물어봐도 찰떡같이! <br />
          <span style={{ fontFamily: 'NanumSquareBold', fontSize: '30px' }}>
            MUMUL Bot은 사전학습 데이터 기반 AI 챗봇 입니다 <br />
            고객의 문의, 대화의 맥락을 이해해서 알맞은 답변을 제공합니다
          </span>
        </p>
      </motion.div>
    </motion.div>
  );

  // 각 서비스 아이템을 렌더링하는 함수
  const renderServiceItem = (description, icon, gradientClass, isMobileSize) => (
    <motion.div
      className={`flex flex-col space-y-1 items-center text-center ${gradientClass} p-4 md:p-6 rounded-lg ${
        isMobileSize ? 'w-44' : 'w-60'
      }`}
      variants={itemVariants} // 스크롤 애니메이션 적용
      initial={{ scale: 1 }} // 초기 scale 값을 명확히 지정
      whileHover={{ scale: 1.1 }} // 마우스 호버 시 확대 애니메이션
      whileTap={{ scale: 1 }} // 클릭 시 축소된 상태를 피하기 위해 1로 설정
    >
      {/* 모바일과 데스크탑 크기 차이를 적용 */}
      <FontAwesomeIcon
        icon={icon}
        className="text-indigo-500 mb-4"
        style={{ width: isMobileSize ? '45px' : '85px', height: isMobileSize ? '45px' : '85px' }}
      />
      <p className={`text-gray-700 font-semibold ${isMobileSize ? 'text-base' : 'text-xl'}`}>{description}</p>
    </motion.div>
  );

  // isMobile 여부에 따라 다른 UI 렌더링
  return isMobile ? renderMobileVersion() : renderDesktopVersion();
};

export default ServiceSection;
