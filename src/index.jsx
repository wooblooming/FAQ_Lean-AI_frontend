import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import FindIdPassword from './pages/FindId';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/findidpassword" component={FindIdPassword} />
        <Route path="/" exact>
          <h1>홈페이지</h1>
        </Route>
        {/* 추가 라우트들 */}
      </Switch>
    </Router>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
