import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots, faCircleQuestion, faTerminal, faHeadset } from '@fortawesome/free-solid-svg-icons';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// ServiceSection 컴포넌트 정의: 메인 서비스 섹션을 구성
const ServiceSection = ({ isMobile }) => {
  // 슬라이드 변경을 위한 상태 초기화
  const [currentSlide, setCurrentSlide] = useState(0); // 현재 슬라이드 인덱스 상태

  // 슬라이더 설정: 슬라이드의 속성 및 사용자 정의 페이징 구성
const sliderSettings = {
  dots: true, // 하단 네비게이션 점 표시
  infinite: true, // 무한 슬라이딩
  speed: 500, // 슬라이드 전환 속도를 500ms로 설정
  slidesToShow: 1, // 한 번에 표시할 슬라이드 수
  slidesToScroll: 1, // 한 번에 이동할 슬라이드 수
  autoplay: true, // 자동 재생 활성화
  autoplaySpeed: 5000, // 자동 재생 간격 5초
  cssEase: "linear", // 애니메이션의 easing 효과를 동일하게 설정
  customPaging: (i) => (
    <div
      style={{
        width: "30px",
        height: "30px",
        border: "1px solid #6366f1",
        borderRadius: "50%",
        color: currentSlide === i ? 'white' : 'black',
        backgroundColor: currentSlide === i ? '#6366f1' : '',
        textAlign: "center",
        fontSize: currentSlide === i ? '20px' : '18px',
        fontWeight: currentSlide === i ? '600' : '',
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.5s ease-in-out" // 숫자 전환에도 애니메이션 속도를 일치시킴
      }}
    >
      {i + 1} {/* 슬라이드 인덱스 1부터 시작 */}
    </div>
  ),
  appendDots: (dots) => (
    <div
      style={{
        borderRadius: '10px',
        padding: '10px',
        position: 'relative',
        display: 'flex',
        justifyContent: 'right',
        bottom: isMobile ? '2px' : '-20px',
        right: isMobile ? '5px' : '-20px',
        transition: "all 0.5s ease-in-out" // 숫자 전환에도 애니메이션 속도를 일치시킴
      }}
    >
      <ul style={{ display: 'flex', justifyContent: 'right', gap: '10px' }}> {dots} </ul>
    </div>
  ),
  afterChange: (current) => setCurrentSlide(current), // 슬라이드 변경 시 현재 슬라이드 인덱스를 업데이트
};

  // 모바일 버전의 렌더링 구성 함수
  const renderMobileVersion = () => (
    <div className="flex flex-col items-center">
      <p className="text-center font-semibold mt-2 mb-4 text-3xl">
        <span className="text-indigo-600">MUMUL 서비스</span>에서는 <br />
        무엇을 할 수 있을까요?
      </p>
      <div className="grid grid-cols-2 gap-4 whitespace-pre-line ">
        {renderServiceItem(`고객 문의에 \n적합한 커맨드 추천`, faTerminal, 'bg-gradient-to-r from-pink-50 to-pink-100', true)}
        {renderServiceItem(`자주 묻는 질문 \n답변 매칭`, faCircleQuestion, 'bg-gradient-to-r from-pink-100 to-purple-100', true)}
        {renderServiceItem(`사전학습 기반 \n답변 생성`, faCommentDots, 'bg-gradient-to-r from-purple-100 to-violet-100', true)}
        {renderServiceItem(`고객 문의 \n데이터 아카이빙`, faHeadset, 'bg-gradient-to-r from-violet-100 to-indigo-100', true)}
      </div>

      {/* 업주 가이드라인 섹션 */}
      <div name='ownerGuideline' className='mt-10 flex items-center justify-center w-full'>
        <div className='flex flex-col items-center space-y-2 w-full'>
          <p className='text-3xl font-bold text-center py-4 justify-center whitespace-nowrap mb-4 w-full' style={{ backgroundColor: '#D9DCF4', width: '95%' }}>
            <span className='text-indigo-600 '>업주</span>는 쉬운 정보 입력
          </p>
          <div className="mt-12 " style={{ width: '95%' }}>
            <Slider {...sliderSettings} style={{ width: '95%' }}>
              {/* 슬라이드 1 */}
              <div className="flex items-center justify-center h-full">
                <div className='flex flex-col justify-center items-center space-y-4'>
                  <img src='/owner1.png' className='rounded-lg ' style={{ width: '80%' }} alt="Owner Guideline 1" />
                  <div className='flex flex-col space-y-2 text-lg text-center'>
                    <p className=" " style={{ fontSize: '20px', fontFamily: 'NanumSquareBold' }}>
                      간단한 가입, 직관적인 UI
                    </p>
                    <p className=" " style={{ fontFamily: 'NanumSquare' }}>
                      30초 만에 가능한 가입 절차, <br />
                      남녀노소 쉽게 접근 가능한 UI로 구성
                    </p>
                  </div>
                </div>
              </div>

              {/* 슬라이드 2 */}
              <div className="flex items-center justify-center h-full">
                <div className='flex flex-col justify-center items-center space-y-4'>
                  <img src='/owner2.png' className='rounded-lg' style={{ width: '80%' }} alt="Owner Guideline 2" />
                  <div className='flex flex-col space-y-2 text-lg text-center'>
                    <p className=" " style={{ fontSize: '20px', fontFamily: 'NanumSquareBold' }}>
                      손쉬운 FAQ 학습 데이터 수정
                    </p>
                    <p className=" " style={{ fontFamily: 'NanumSquare' }}>
                      제공되는 양식에 FAQ에 대한 정보를 입력하여, <br />
                      초기 데이터는 영업일 기준 3일 내, <br />
                      수정된 정보는 1일 내 반영됩니다.
                    </p>
                  </div>
                </div>
              </div>

              {/* 슬라이드 3 */}
              <div className="flex items-center justify-center h-full">
                <div className='flex flex-col justify-center items-center space-y-4'>
                  <img src='/owner3.png' className='rounded-lg' style={{ width: '80%' }} alt="Owner Guideline 3" />
                  <div className='flex flex-col space-y-2 text-lg text-center'>
                    <p className=" " style={{ fontSize: '20px', fontFamily: 'NanumSquareBold' }}>
                      실시간 매장 기본 정보 수정
                    </p>
                    <p className=" " style={{ fontFamily: 'NanumSquare' }}>
                      배너 사진, 영업 정보 등 간단한 매장 정보는 <br />
                      실시간으로 반영됩니다.
                    </p>
                  </div>
                </div>
              </div>
            </Slider>
          </div>
        </div>
      </div>

      {/* 고객 가이드라인 섹션 */}
      <div name='customerGuideline' className='mt-10 flex items-center justify-center w-full mx-4'>
        <div className='flex flex-col items-center space-y-2 w-full'>
          <p className='text-3xl font-bold text-center py-4 justify-center whitespace-nowrap mb-4 w-full' style={{ backgroundColor: '#FFDFE8', width: '95%' }}>
            <span className='text-indigo-600 '>고객</span>는 쉬운 서비스 접근
          </p>
          <div className="mt-12" style={{ width: '95%' }}>
            <Slider {...sliderSettings} style={{ width: '95%' }}>
              {/* 슬라이드 1 */}
              <div className="flex items-center justify-center h-full">
                <div className='flex flex-col justify-center items-center space-y-4'>
                  <img src='/customer1.png' className='rounded-lg ' style={{ width: '80%' }} alt="Customer Guideline 1" />
                  <div className='flex flex-col space-y-2 text-lg text-center'>
                    <p className=" " style={{ fontSize: '20px', fontFamily: 'NanumSquareBold' }}>
                      QR코드 스캔
                    </p>
                    <p className=" " style={{ fontFamily: 'NanumSquare' }}>
                      업장마다 고유의 QR코드를 제공, <br />
                      테이블, 벽 의자 어디에든 설치 가능합니다
                    </p>
                  </div>
                </div>
              </div>

              {/* 슬라이드 2 */}
              <div className="flex items-center justify-center h-full">
                <div className='flex flex-col justify-center items-center space-y-4'>
                  <img src='/customer2.png' className='rounded-lg' style={{ width: '80%' }} alt="Customer Guideline 2" />
                  <div className='flex flex-col space-y-2 text-lg text-center'>
                    <p className=" " style={{ fontSize: '20px', fontFamily: 'NanumSquareBold' }}>
                      매장 정보 확인
                    </p>
                    <p className=" " style={{ fontFamily: 'NanumSquare' }}>
                      노출하시고자 하는 정보를 <br />
                      고객들이 확인할 수 있습니다.
                    </p>
                  </div>
                </div>
              </div>

              {/* 슬라이드 3 */}
              <div className="flex items-center justify-center h-full">
                <div className='flex flex-col justify-center items-center space-y-4'>
                  <img src='/customer3.png' className='rounded-lg' style={{ width: '80%' }} alt="Customer Guideline 3" />
                  <div className='flex flex-col space-y-2 text-lg text-center'>
                    <p className=" " style={{ fontSize: '20px', fontFamily: 'NanumSquareBold' }}>
                      AI 챗봇 '무물봇'
                    </p>
                    <p className=" " style={{ fontFamily: 'NanumSquare' }}>
                      사전 학습된 정보를 바탕으로 <br />
                      업장에 필요한 모든 정보를 제공합니다.
                    </p>
                  </div>
                </div>
              </div>
            </Slider>
          </div>
        </div>
      </div>
    </div>
  );

  // 데스크탑 버전의 렌더링 구성 함수
  const renderDesktopVersion = () => (
    <>
      {/* 서비스 소개 섹션 */}
      <div className="flex flex-col w-full">
        <p className="text-center font-semibold m-8 text-4xl">
          <span className="text-indigo-600">MUMUL 서비스</span>에서는 무엇을 할 수 있을까요?
        </p>
        <div className="flex flex-row items-center justify-center whitespace-pre-line space-x-6">
        {renderServiceItem(`고객 문의에 \n적합한 커맨드 추천`, faTerminal, 'bg-gradient-to-r from-pink-50 to-pink-100', false)}
        {renderServiceItem(`자주 묻는 질문 \n답변 매칭`, faCircleQuestion, 'bg-gradient-to-r from-pink-100 to-purple-100', false)}
        {renderServiceItem(`사전학습 기반 \n답변 생성`, faCommentDots, 'bg-gradient-to-r from-purple-100 to-violet-100', false)}
        {renderServiceItem(`고객 문의 \n데이터 아카이빙`, faHeadset, 'bg-gradient-to-r from-violet-100 to-indigo-100', false)}
        </div>

        {/* 텍스트 벨트 섹션 */}
        <div className="-skew-y-3 h-auto mt-32 flex flex-col text-center text-white w-full" style={{ backgroundColor: '#FF609E', fontFamily: 'NanumSquareBold' }}>
          <p style={{ fontFamily: 'NanumSquareExtraBold', fontSize: '40px' }}>
            대충 물어봐도 찰떡같이! <br />
            <span style={{ fontFamily: 'NanumSquareBold', fontSize: '30px' }}>
              MUMUL Bot은 사전학습 데이터 기반 AI 챗봇입니다 <br />
              고객의 문의, 대화의 맥락을 이해해서 알맞은 답변을 제공합니다.
            </span>
          </p>
        </div>
      </div>

      {/* 업주 가이드라인 섹션 */}
      <div name='ownerGuideline' className='mt-32 flex items-center justify-center w-full'>
        <div className='flex flex-col items-center space-y-4 w-full'>
          <p className='text-4xl font-bold text-center p-4 justify-center whitespace-nowrap mb-4 w-full' style={{ backgroundColor: '#D9DCF4' }}>
            <span className='text-indigo-600 '>업주</span>는 쉬운 정보 입력
          </p>
          <div className="w-11/12 mt-12 border border-gray-400 p-8">
            <Slider {...sliderSettings} className="w-full">
              {/* 슬라이드 1 */}
              <div className="flex items-center justify-center h-full">
                <div className='flex flex-row justify-center items-center space-x-20'>
                  <img src='/owner1.png' className='rounded-lg ' style={{ width: '40%' }} alt="Owner Guideline 1" />
                  <div className='flex flex-col space-y-4 text-xl text-center justify-center items-center'>
                    <p className=" " style={{ fontSize: '30px', fontFamily: 'NanumSquareBold' }}>
                      간단한 가입, 직관적인 UI
                    </p>
                    <p className=" " style={{ fontFamily: 'NanumSquare' }}>
                      30초 만에 가능한 가입 절차, <br />
                      남녀노소 쉽게 접근 가능한 UI로 구성
                    </p>
                  </div>
                </div>
              </div>

              {/* 슬라이드 2 */}
              <div className="flex items-center justify-center h-full">
                <div className='flex flex-row justify-center items-center space-x-20'>
                  <img src='/owner2.png' className='rounded-lg' style={{ width: '40%' }} alt="Owner Guideline 2" />
                  <div className='flex flex-col space-y-4 text-xl text-center justify-center items-center'>
                    <p className=" " style={{ fontSize: '30px', fontFamily: 'NanumSquareBold' }}>
                      손쉬운 FAQ 학습 데이터 수정
                    </p>
                    <p className=" " style={{ fontFamily: 'NanumSquare' }}>
                      제공되는 양식에 FAQ에 대한 정보를 입력하여, <br />
                      초기 데이터는 영업일 기준 3일 내, <br />
                      수정된 정보는 1일 내 반영됩니다.
                    </p>
                  </div>
                </div>
              </div>

              {/* 슬라이드 3 */}
              <div className="flex items-center justify-center h-full">
                <div className='flex flex-row justify-center items-center  items-center space-x-20'>
                  <img src='/owner3.png' className='rounded-lg' style={{ width: '40%' }} alt="Owner Guideline 3" />
                  <div className='flex flex-col space-y-4 text-xl text-center justify-center items-center'>
                    <p className=" " style={{ fontSize: '30px', fontFamily: 'NanumSquareBold' }}>
                      실시간 매장 기본 정보 수정
                    </p>
                    <p className=" " style={{ fontFamily: 'NanumSquare' }}>
                      배너 사진, 영업 정보 등 간단한 매장 정보는 <br />
                      실시간으로 반영됩니다.
                    </p>
                  </div>
                </div>
              </div>
            </Slider>
          </div>
        </div>
      </div>

      {/* 고객 가이드라인 섹션 */}
      <div name='customerGuideline' className='mt-20 flex items-center justify-center w-full'>
        <div className='flex flex-col items-center space-y-4 w-full'>
          <p className='text-4xl font-bold text-center p-4 justify-center whitespace-nowrap mb-4 w-full' style={{ backgroundColor: '#FFDFE8' }}>
            <span className='text-indigo-600 '>고객</span>는 쉬운 서비스 접근
          </p>
          <div className="w-11/12 mt-12 border border-gray-400 p-8">
            <Slider {...sliderSettings} className="w-full">
              {/* 슬라이드 1 */}
              <div className="flex items-center justify-center h-full">
                <div className='flex flex-row p-4 justify-center items-center space-x-20'>
                  <img src='/customer1.png' className='rounded-lg ' style={{ width: '40%' }} alt="customer Guideline 1" />
                  <div className='flex flex-col space-y-4 text-xl text-center'>
                    <p className=" " style={{ fontSize: '30px', fontFamily: 'NanumSquareBold' }}>
                      QR코드 스캔
                    </p>
                    <p className=" " style={{ fontFamily: 'NanumSquare' }}>
                      업장마다 고유의 QR코드를 제공, <br />
                      테이블, 벽 의자 어디에든 설치 가능합니다
                    </p>
                  </div>
                </div>
              </div>

              {/* 슬라이드 2 */}
              <div className="flex items-center justify-center h-full">
                <div className='flex flex-row p-4 justify-center items-center space-x-20'>
                  <img src='/customer2.png' className='rounded-lg' style={{ width: '40%' }} alt="Customer Guideline 2" />
                  <div className='flex flex-col space-y-4 text-xl text-center'>
                    <p className=" " style={{ fontSize: '30px', fontFamily: 'NanumSquareBold' }}>
                      매장 정보 확인
                    </p>
                    <p className=" " style={{ fontFamily: 'NanumSquare' }}>
                      노출하시고자 하는 정보를 <br />
                      고객들이 확인할 수 있습니다.
                    </p>
                  </div>
                </div>
              </div>

              {/* 슬라이드 3 */}
              <div className="flex items-center justify-center h-full">
                <div className='flex flex-row p-4 justify-center items-center space-x-20'>
                  <img src='/customer3.png' className='rounded-lg' style={{ width: '40%' }} alt="Customer Guideline 3" />
                  <div className='flex flex-col space-y-4 text-xl text-center '>
                    <p className=" " style={{ fontSize: '30px', fontFamily: 'NanumSquareBold' }}>
                      AI 챗봇 '무물봇'
                    </p>
                    <p className=" " style={{ fontFamily: 'NanumSquare' }}>
                      사전 학습된 정보를 바탕으로 <br />
                      업장에 필요한 모든 정보를 제공합니다.
                    </p>
                  </div>
                </div>
              </div>
            </Slider>
          </div>
        </div>
      </div>

      {/* 도입 시 좋은 점 */}
      <div className="flex flex-col w-full">
        <p className="text-center font-semibold m-8 text-4xl">
          <span className="text-indigo-600">MUMUL</span>을 선택해야하는 이유!
        </p>
      </div>
    </>
  );

  // 단일 서비스 아이템을 렌더링하는 함수
  const renderServiceItem = (description, icon, gradientClass, isMobileSize) => (
    <div className={`flex flex-col space-y-1 items-center text-center ${gradientClass} p-4 md:p-6 rounded-lg ${isMobileSize ? 'w-44' : 'w-60'}`}>
      {/* 모바일과 데스크탑 크기 차이를 적용 */}
      <FontAwesomeIcon
        icon={icon}
        className="text-indigo-500 mb-4"
        style={{ width: isMobileSize ? '45px' : '85px', height: isMobileSize ? '45px' : '85px' }}
      />
      <p className={`text-gray-700 font-semibold ${isMobileSize ? 'text-base' : 'text-xl'}`} style={{ fontFamily: 'NanumSquare' }}>{description}</p>
    </div>
  );

  // 최종 반환: 모바일 버전인지 아닌지에 따라 다른 렌더링 함수를 호출
  return isMobile ? renderMobileVersion() : renderDesktopVersion();
};

export default ServiceSection;
