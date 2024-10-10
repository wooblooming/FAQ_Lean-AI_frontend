import React, { useState } from 'react';
import Image from 'next/image';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const SliderComponent = () => {  
  // 활성화된 슬라이드 인덱스를 상태로 관리
  const [activeSlide, setActiveSlide] = useState(0);

  const images = [
    '/index1.png',
    '/index2.png',
    '/index3.png',
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
    adaptiveHeight: true,
    beforeChange: (oldIndex, newIndex) => setActiveSlide(newIndex), // 슬라이드 변경 시 활성화된 인덱스 업데이트
    appendDots: dots => (
      <div
        style={{
          position: 'absolute',
          bottom: '10px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ul style={{ margin: 0 }}>{dots}</ul>
      </div>
    ),
    customPaging: (i) => (
      <div
        style={{
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          background: i === activeSlide ? '#6366f1' : '#c7d2fe',
          margin: '0 5px',
          cursor: 'pointer',
          transition: 'background 0.3s ease, transform 0.3s ease',
          
        }}
      />
    ),
  };

  return (
    <div className="slider-container">
      <Slider {...sliderSettings}>
        {images.map((src, index) => (
          <div key={index} className="slide-item">
            <div
              className="image-container"
              style={{ position: 'relative', width: '98%', height: '65vh' }}
            >
              <Image
                src={src}
                alt={`Slide ${index + 1}`}
                fill
                style={{ objectFit: 'cover' }} // objectFit을 style로 대체
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // 적절한 sizes 값 설정
                priority
              />
            </div>
          </div>
        ))}
      </Slider>

      <style jsx global>{`
        .slick-next, .slick-prev {
          display: none !important;
        }
        .slick-dots {
          position: absolute;
          width: 100%;
          display: flex !important;
          justify-content: center;
          list-style: none;
          z-index: 1000;
        }
        .slick-dots li {
          display: inline-block;
          margin: 0 5px;
        }
        .slick-dots li button {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: #c7d2fe !important;
          cursor: pointer;
          border: none;
          transition: background 0.3s ease, transform 0.3s ease;
        }
        .slick-dots li.slick-active button {
          background-color: #ca8a04 !important;
          transform: scale(1.3) !important;
          border: 2px solid #4f46e5 !important;
        }
      `}</style>
    </div>
  );
};

export default SliderComponent;
