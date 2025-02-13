import React from 'react';
const ConvertSwitch = ({ isPublicOn, togglePublicOn }) => {
  return (
    <div className="flex flex-col items-start mb-4">
      <div className="flex flex-row items-center">
          <div className="px-2" style={{ fontFamily: "NanumSquareBold" }}>공공기관 직원이신가요?</div>
        <div>
          <label className="switch">
            <input
              type="checkbox"
              checked={isPublicOn}
              onChange={togglePublicOn}  // 스위치 상태 변경 시 동작
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>

      <style jsx>{`
        .switch {
          position: relative;
          display: inline-block;
          width: 42px;
          height: 26px;
        }

        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: 0.4s;
          border-radius: 34px;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 20px;
          width: 20px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: 0.4s;
          border-radius: 50%;
        }

        input:checked + .slider {
          background-color: #6366f1;
        }

        input:checked + .slider:before {
          transform: translateX(16px);
        } `
      }
      </style>
    </div>
  );
};

export default ConvertSwitch;
