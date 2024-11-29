import React from 'react';

const AwardsData = ({ limit }) => {
  const awardsList = [
    { year: '2020년', content: '2020 4IR Awards AI부문 대상' },
    { year: '2019년', content: '제 4회 서울혁신챌린지 최우수상(1등)' },
    { year: '2019년', content: '안암동 캠퍼스타운 창업경진대회 금상 (1등)' },
    { year: '2019년', content: '산업지능화 스타트업 창업경진대회 우수상 (2등)' },
    { year: '2018년', content: '고려대 SW중심대학 창업경진대회 최우수상 (2등)' },
    { year: '2018년', content: 'SW시장성 테스트 지원사업 정보통신산업진흥원 원장상 (2등)' },
    { year: '2017년', content: '서울창업디딤터 대학생 창업동아리 성과 발표회 인기상' },
    { year: '2017년', content: '대학 창업유망팀 300 시제품 전시회 부총리겸 교육부 장관상 (1등)' },
    { year: '2017년', content: '미래에셋대우 청년창업지원 프로젝트 최우수상 (1등)' },
    { year: '2017년', content: '고려대 크라우드펀딩 경진대회 장려상' },
    { year: '2017년', content: 'KU Lean Innovation Challenge&Startup 경진대회 Lean Startup상 (2등)' },
    { year: '2016년', content: '제 17회 KU Campus&RnD CEO 경진대회 최우수상 (1등)' },
    { year: '2016년', content: '제 1회 고려대 모의크라우드펀딩 경진대회 장려상 ' },
  ];

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
