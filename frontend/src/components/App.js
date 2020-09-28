import React, { Suspense, lazy } from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Form, Checkbox, TextArea, Header, Divider } from 'semantic-ui-react';

import Home from './routes/Home'
import Login from './routes/Login'
import CreateAccount from './routes/CreateAccount'
import Profile from './routes/Profile'
import Matches from './routes/Matches'
// const Profile = lazy(() => import('./routes/Profile'));

function App() {
  return (
    <>
      <Header as="h1" textAlign="center">Match Score</Header>
      <Router>
          <Switch>
            <Route path="/create-account" component={CreateAccount} />
            <Route path="/login" component={Login} />
            <Route path="/home" component={Home} />
            <Route path="/profile" component={Profile} />
            <Route path="/matches" component={Matches} />
          </Switch>
      </Router>
    </>
  );
}

export default App;

const container = document.getElementById('app');
render(<App />, container);