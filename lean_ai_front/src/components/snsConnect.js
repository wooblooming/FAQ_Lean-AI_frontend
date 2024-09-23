import React from 'react';
import Image from 'next/image';

const SnsConnect = ({ snsList, toggleSnsConnection }) => {
  return (
    <div>
      <div className="flex items-start w-full font-semibold ">SNS 계정 정보</div>
      {snsList.map((sns) => (
        <div key={sns.name} className="flex flex-row justify-between items-center font-sans mb-1">
          <div className="flex items-center ml-2">
            <span>
              <Image
                src={sns.icon}
                className="mr-2"
                alt={sns.name}
                width={20}
                height={20}
              />
            </span>
            <p className="whitespace-nowrap">{sns.displayName} 연결하기</p>
          </div>
          <div>
            <label className="switch">
              <input
                type="checkbox"
                checked={sns.isConnected}
                onChange={() => toggleSnsConnection(sns.name)}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>
      ))}

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
        background-color: #8b5cf6;
      }

      input:checked + .slider:before {
        transform: translateX(16px);
      }
    `}
    </style>

    </div>
  );
};

export default SnsConnect;
