import React from 'react';
import historyList from '/public/text/history.json';

const HistoryData = ({ limit }) => {

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
