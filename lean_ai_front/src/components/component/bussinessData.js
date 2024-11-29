import React from 'react';

const BussinessData = ({ limit }) => {
  const bussinessList = [
    { content: '글로벌 기업 협업프로그램 선정 (마중-MS 협업)' },
    { content: '현재 데이터바우처지원사업 32개사 AI학습용 데이터 수집/가공' },
    { content: '현재 AI바우처지원사업 26개사 AI솔루션 구축' },
  ]

  return (
    <div>
      <ul className="list-none">
        {bussinessList.slice(0, limit).map((bussiness, index) => (
          <li
            key={index}
            className="flex items-center space-x-2"
            style={{ position: 'relative', paddingLeft: '1.5rem' }}
          >
            <span
              className="truncate"
              style={{
                fontFamily: 'NanumSquare',
                width: '90%',
              }}
            >
              {bussiness.content}
            </span>
          </li>
        ))}
      </ul>

      <style jsx>{`
        li::before {
          content: '•';
          position: absolute;
          left: 0;
          color: black; /* 점 색상 */
          font-size: 1.2rem; /* 점 크기 */
        }
      `}
      </style>
    </div>
  );
};

export default BussinessData;
