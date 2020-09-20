import React, { Suspense, lazy } from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
//import 'semantic-ui-css/semantic.min.css'

import Home from './routes/Home'
import Login from './routes/Login'
import CreateAccount from './routes/CreateAccount'
import Profile from './routes/Profile'
// const Profile = lazy(() => import('./routes/Profile'));

function App() {
  return (
    <Router>
        <Switch>
          <Route path='/create-account' component={CreateAccount} />
          <Route path='/login' component={Login} />
          <Route path='/home' component={Home} />
          <Route path='/profile' component={Profile} />
        </Switch>
    </Router>
  );
}

export default App;

const container = document.getElementById('app');
render(<App />, container);