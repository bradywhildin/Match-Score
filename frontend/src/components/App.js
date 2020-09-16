import React, { Suspense, lazy } from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// const Home = lazy(() => import('./routes/Home'));
// const Login = lazy(() => import('./routes/Login'));
import Home from './routes/Home'
import Login from './routes/Login'
import CreateAccount from './routes/CreateAccount'

function App() {
  return (
    <Router>
      <Switch>
        <Route path='/createAccount' component={CreateAccount} />
        <Route path='/login' component={Login} />
        <Route path='/home' component={Home} />
      </Switch>
    </Router>
  );
}

export default App;

const container = document.getElementById('app');
render(<App />, container);