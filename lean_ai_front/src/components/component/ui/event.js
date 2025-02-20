import React from 'react';
const EventSwitch = ({ isEventOn, toggleEventOn }) => {
  return (
    <div className="flex flex-col items-start mb-4">
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-col mr-11">
          <div className="flex items-start w-full font-semibold text-lg" style={{ fontFamily: "NanumSquareExtraBold" }}>이벤트, 혜택 정보</div>
          <div className="text-sm text-gray-500 ml-2" style={{ fontFamily: "NanumSquare" }}> 이벤트, 프로모션 등 혜택 정보 알림</div>
        </div>
        <div>
          <label className="switch">
            <input
              type="checkbox"
              checked={isEventOn}
              onChange={(e) => toggleEventOn(e.target.checked)} 
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

export default EventSwitch;
