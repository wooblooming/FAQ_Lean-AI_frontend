import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FindIdPassword from './pages/FindId';
import FindPassword from './pages/FindPassword';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<h1>홈페이지</h1>} />
        <Route path="/findid" element={<FindIdPassword />} />
        <Route path="/findpassword" element={<FindPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
