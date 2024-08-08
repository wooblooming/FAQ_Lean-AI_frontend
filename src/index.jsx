import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import FindIdPassword from './pages/FindId';
import LoadingPage from './pages/LoadingPage'; // 로딩 페이지 컴포넌트 import
import StoreIntroductionPage from './pages/StoreIntroductionPage'; // 매장 소개 페이지 컴포넌트 import
import ChatbotPage from './pages/ChatbotPage'; // Chatbot 페이지 컴포넌트 import

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/findidpassword" component={FindIdPassword} />
        <Route path="/" exact>
          <h1>홈페이지</h1>
        </Route>

        {/* customer site */}
        <Route path="/customer" element={<LoadingPage />} />
        <Route path="/customer-introduce" element={<StoreIntroductionPage />} />
        <Route path="/chatbot" element={<ChatbotPage />} />
      </Switch>
    </Router>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
