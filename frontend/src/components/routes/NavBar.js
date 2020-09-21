import React from 'react';
import { Menu } from 'semantic-ui-react'
import { Link } from 'react-router-dom';

function NavBar(props) {
  console.log(props);
  const current = props.current;
  const items = [
    { as: Link, content: "Home", active: current=='home', key: "home", to: "/home" },
    { as: Link, content: "Login", active: current=='login', key: "login", to: "/login" },
    { as: Link, content: "Profile", active: current=='profile', key: "profile", to: "/profile" },
    { as: Link, content: "Create Account", active: current=='createAccount', key: "createAccount", to: "/create-account" },
  ];
  return <Menu items={items} />;
}

export default NavBar;