import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react'
import { Link } from 'react-router-dom';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { isFuture } from 'date-fns';
import checkForUser from './utilities/checkForUser'

function logout(e) {
  window.localStorage.removeItem('access');
  window.localStorage.removeItem('refresh');
  window.localStorage.removeItem('expiration');
  window.location.href = '/login';
}

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
    };
  }

  async componentDidMount() {
    const current = this.props.current;
    const loggedIn = this.props.loggedIn;
    var items;
    if (loggedIn) {
      items = [
        { as: Link, content: 'Home', active: current=='home', key: 'home', to: '/home' },
        { as: Link, content: 'Matches', active: current=='matches', key: 'matches', to: '/matches' },
        { as: Link, content: 'Profile', active: current=='profile', key: 'profile', to: '/profile' },
        { name: 'Logout', key: 'logout', onClick: logout, position: 'right' },
      ];
    } else {
      items = [
        { as: Link, content: 'Login', active: current=='login', key: 'login', to: '/login' },
        { as: Link, content: 'Create Account', active: current=='createAccount', key: 'createAccount', to: '/create-account' },
      ];
    };
    this.setState({ items: items});
  }

  render() {
    return <div className="navDiv"><Menu items={this.state.items} /></div>
  }
};

export default NavBar;