// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import LoadingPage from './LoadingPage'; // 로딩 페이지 컴포넌트 import
import StoreIntroductionPage from './StoreIntroductionPage'; // 매장 소개 페이지 컴포넌트 import
import ChatbotPage from './ChatbotPage'; // Chatbot 페이지 컴포넌트 import

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoadingPage />} />
        <Route path="/customer-introduce" element={<CustomerIntroduce />} />
        {/* 다른 라우트 추가 */}
      </Routes>
    </Router>
  );
};

export default App;
