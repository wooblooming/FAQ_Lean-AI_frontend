// src/App.js
import React from 'react';
// src/index.js
import './index.css'; // Tailwind CSS를 포함한 CSS 파일을 import
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import LandingMenu from './pages/LandingMenu';
import Login from './pages/Login';
import FindId from './pages/FindId';
import FindPassword from './pages/FindPassword';
import Loading from './pages/Loading'; 
import StoreIntroduction from './pages/StoreIntroduction'; 
import Chatbot from './pages/Chatbot'; 
import IdFinder from './pages/IdFinder';
import PsFinder from './pages/PsFinder';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingMenu/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/findid" element={<FindId/>} />
        <Route path="/findpassword" element={<FindPassword/>} />
        <Route path='/idfinder'element={<IdFinder/>} />
        <Route path='/PsFinder'element={<PsFinder/>} />

        {/* 임시 라우트 */}
        <Route path="/mypage" element={<h1>마이페이지</h1>} />
        <Route path="/notice" element={<h1>공지사항</h1>} />
        <Route path="/qna" element={<h1>FQA</h1>} />


        {/* customer site */}
        <Route path="/customer" element={<Loading />} />
        <Route path="/customer-introduce" element={<StoreIntroduction />} />
        <Route path="/chatbot" element={<Chatbot />} />
      </Routes>
    </Router>
  );
};

export default App;
