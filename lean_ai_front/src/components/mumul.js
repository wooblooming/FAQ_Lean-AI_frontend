import React, { useEffect } from 'react';

const AnimationComponent = ({ onAnimationEnd }) => {
  // 애니메이션이 끝난 후 콜백을 호출하는 타이머 설정
  useEffect(() => {
    const timer = setTimeout(() => {
      onAnimationEnd(); // 애니메이션이 끝나면 부모 컴포넌트에서 전달한 콜백 호출
    }, 3000); // 애니메이션 지속 시간

    return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 해제
  }, [onAnimationEnd]);

  return (
    <div className="animation-container">
      <div className="wrapper">
        <div className="focus">MUMUL</div>
        <div className="mask">
          <div className="text">MUMUL</div>
        </div>
      </div>
      <style jsx>{`
        /* 전체 화면에 배경색 적용 */
        .animation-container {
          width: 100vw;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #4e46e5; /* 배경색 */
        }

        .wrapper {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 235px;
        height: 70px;
        white-space: nowrap;
      }

      .focus {
        position: absolute;
        transform: translateX(0);
        font-family: Arial;
        text-transform: uppercase;
        letter-spacing: 2px;
        filter: blur(3px);
        font-size: 65px;
        opacity: 0.6;
        color: #fff;
      }

      .mask {
        position: absolute;
        left: -5px;
        top: -2px;
        width: 70px;
        font-family: Arial;
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 2px;
        font-size: 65px;
        clip: rect(0px, 70px, 75px, 0px);

        background-size: 10px 2px, 2px 10px, 10px 2px, 2px 10px, 10px 2px, 2px 10px, 10px 2px, 2px 10px;

        color: #fff;
        padding: 5px;
        transform: translateX(0);
        box-sizing: border-box;
        -webkit-animation: mask 2.5s ease infinite alternate;
        animation: mask 2.5s ease infinite alternate;
      }

      .text {
        transform: translateX(0);
        -webkit-animation: text 2.5s ease infinite alternate;
        animation: text 2.5s ease infinite alternate;
      }

      @-webkit-keyframes mask {
        to {
          transform: translateX(170px);
        }
      }

      @keyframes mask {
        to {
          transform: translateX(170px);
        }
      }
      @-webkit-keyframes text {
        to {
          transform: translateX(-170px);
        }
      }
      @keyframes text {
        to {
          transform: translateX(-170px);
        }
      }
      `}</style>
    </div>
  );
};

export default AnimationComponent;
