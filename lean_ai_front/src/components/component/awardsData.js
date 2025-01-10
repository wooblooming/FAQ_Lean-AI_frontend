import React from 'react';
import awardsList from '/public/text/award.json'

const AwardsData = ({ limit }) => {

  return (
    <div>
      <ul>
        {awardsList.slice(0, limit).map((award, index) => (
          <li key={index} className="flex items-center space-x-2" style={{ position: 'relative', paddingLeft: '1.5rem' }}>
            <span className="whitespace-nowrap" style={{ fontFamily: "NanumSquareBold" }}>{award.year}</span>
            <span className="truncate" style={{ fontFamily: "NanumSquare", width: '65%' }}>{award.content}</span>
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

export default AwardsData;
