import React from 'react';
import businessList from '/public/text/business.json';

const BusinessData = ({ limit }) => {

  return (
    <div>
      <ul className="list-none">
        {businessList.slice(0, limit).map((business, index) => (
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
              {business.content}
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

export default BusinessData;
