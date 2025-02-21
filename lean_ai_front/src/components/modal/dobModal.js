import React, { useState, useEffect } from "react";
import ModalText from './modalText';

const DOBModal = ({ show, onClose, onSubmit, initialDOB, setErrorMessage}) => {
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [error, setError] = useState('');

  // 모달이 열릴 때 초기값 설정
  useEffect(() => {
    if (show && initialDOB) {
      if (initialDOB.includes('-')) {
        // YYYY-MM-DD 형식 처리
        const parts = initialDOB.split('-');
        if (parts.length === 3) {
          setYear(parts[0]);
          setMonth(parts[1]);
          setDay(parts[2]);
        }
      } else if (initialDOB.length === 6) {
        // YYMMDD 형식 처리
        setYear(`19${initialDOB.substring(0, 2)}`);
        setMonth(initialDOB.substring(2, 4));
        setDay(initialDOB.substring(4, 6));
      }
    } else {
      // 값이 없거나 모달이 닫힐 때 초기화
      setDay('');
      setMonth('');
      setYear('');
      setError('');
    }
  }, [show, initialDOB]);

  // 연도 선택 옵션
  const yearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let y = currentYear; y >= currentYear - 100; y--) {
      years.push(
        <option key={y} value={y}>
          {y}
        </option>
      );
    }
    return years;
  };

  // 월 선택 옵션
  const monthOptions = () => {
    const months = [];
    for (let m = 1; m <= 12; m++) {
      const monthValue = m.toString().padStart(2, '0');
      months.push(
        <option key={m} value={monthValue}>
          {monthValue}
        </option>
      );
    }
    return months;
  };

  // 일 선택 옵션
  const dayOptions = () => {
    const days = [];
    // 해당 월의 마지막 날짜 계산
    let lastDay = 31;
    if (month) {
      const selectedYear = parseInt(year || new Date().getFullYear());
      const selectedMonth = parseInt(month);
      lastDay = new Date(selectedYear, selectedMonth, 0).getDate();
    }

    for (let d = 1; d <= lastDay; d++) {
      const dayValue = d.toString().padStart(2, '0');
      days.push(
        <option key={d} value={dayValue}>
          {dayValue}
        </option>
      );
    }
    return days;
  };

  // 제출 처리
  const handleSubmit = () => {
    if (!year || !month || !day) {
      setError('생년월일을 모두 입력해주세요.');
      return;
    }

    // 날짜 유효성 검사
    const dateStr = `${year}-${month}-${day}`;
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      setError('유효하지 않은 날짜입니다.');
      return;
    }

    // YYMMDD 형식으로 변환
    const formattedYear = year.slice(-2);
    const dobFormatted = `${formattedYear}${month}${day}`;
    
    onSubmit(dobFormatted);
    onClose();
  };

  if (!show) return null;

  return (
    <ModalText show={show} onClose={onClose} title="생년월일 입력">
      <div className="p-4">
        <span className="text-red-500 text-lg" style={{fontFamily:'NanumSqareBold'}}>{setErrorMessage}</span>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            생년월일을 선택해주세요
          </label>
          <div className="flex space-x-2">
            {/* 연도 선택 */}
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="border rounded-md p-2 w-1/3"
            >
              <option value="">년도</option>
              {yearOptions()}
            </select>
            
            {/* 월 선택 */}
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="border rounded-md p-2 w-1/3"
            >
              <option value="">월</option>
              {monthOptions()}
            </select>
            
            {/* 일 선택 */}
            <select
              value={day}
              onChange={(e) => setDay(e.target.value)}
              className="border rounded-md p-2 w-1/3"
            >
              <option value="">일</option>
              {dayOptions()}
            </select>
          </div>
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
        
        <div className="flex justify-center space-x-3 mt-6">
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            확인
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            취소
          </button>
        </div>
      </div>
    </ModalText>
  );
};

export default DOBModal;