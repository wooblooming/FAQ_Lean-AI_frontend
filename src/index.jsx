import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LandingMenu from './pages/LandingMenu';
import Login from './pages/Login';
import FindId from './pages/FindId';
import FindPassword from './pages/FindPassword';
import Loading from './pages/Loading'; 
import StoreIntroduction from './pages/StoreIntroduction'; 
import Chatbot from './pages/Chatbot'; 

function App() {
  return (
    <Router>
      <Switch>
      <Routes>
        <Route path="/" element={<LandingMenu/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/FindId" element={<FindId/>} />
        <Route path="/findpassword" element={<FindPassword/>} />

        {/* customer site */}
        <Route path="/customer" element={<Loading />} />
        <Route path="/customer-introduce" element={<StoreIntroduction />} />
        <Route path="/chatbot" element={<Chatbot />} />
      </Routes>
      </Switch>
    </Router>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
