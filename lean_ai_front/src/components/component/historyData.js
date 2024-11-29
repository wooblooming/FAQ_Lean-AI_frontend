import React from 'react';

const HistoryData = ({ limit }) => {
  const historyList = [
    { year: '2024년', content: '주식회사 린에이아이로 법인명 변경' },
    { year: '2022년', content: 'AI바우처지원사업 공급기업 선정' },
    { year: '2021년', content: '데이터바우처지원사업 공급기업 선정' },
    { year: '2018년', content: 'AI 학습용 데이터 수집/가공 플랫폼 \'린에이아이(LeanAI)\' 런칭' },
    { year: '2017년', content: '주식회사 잡쇼퍼 설립' }
  ]

  return (
    <div>
      <ul>
        {historyList.slice(0, limit).map((history, index) => (
          <li key={index} className="flex items-center space-x-2" style={{ position: 'relative', paddingLeft: '1.5rem' }}>
            <span className="font-bold whitespace-nowrap" style={{ fontFamily: "NanumSquareBold" }}>{history.year}</span>
            <span className='truncate' style={{ fontFamily: "NanumSquare", width: '65%' }}>{history.content}</span>
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

export default HistoryData;
