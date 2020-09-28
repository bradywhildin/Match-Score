import React, { Component } from 'react';
import { render } from 'react-dom';
import { withRouter } from 'react-router-dom'
import Cookies from 'js-cookie'
import { add } from 'date-fns'
import NavBar from './NavBar';
import { Form, Checkbox, TextArea, Header, Divider } from 'semantic-ui-react';

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };

    this.handleChangeUsername = this.handleChangeUsername.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChangeUsername(e, {value}) {
    this.setState({ username: {value}.value });
  }

  handleChangePassword(e, {value}) {
    this.setState({ password: {value}.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    console.log(Cookies.get('csrftoken'))
    const requestOptions = {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password
      })
    };
    fetch('api/token/', requestOptions)
      .then(response => {
        if (response.status > 400) {
          alert('Wrong email/password')
          throw new Error('Wrong Email/Password');
        };
        return response.json();
      })
      .then(data => {
        const expiration = add(new Date(), { minutes: 4, seconds: 30 })
        window.localStorage.setItem('access', data.access);
        window.localStorage.setItem('refresh', data.refresh);
        window.localStorage.setItem('expiration', expiration)
        this.props.history.push('/home');
      })
      .catch(e => {
        console.log('Error:', e);
      })
  }

  render() {
    return (
      <Form onSubmit={this.handleSubmit} className="userForm">
        <Form.Input label="Username" onChange={this.handleChangeUsername} />
        <Form.Input label="Password" onChange={this.handleChangePassword} type="password" />
        <Form.Button className="formSubmit">Login</Form.Button>
      </Form>
    )
  }
}

class Login extends Component {
  render() {
    return (
      <div>
        <NavBar current="login" loggedIn={false} />
        <LoginForm history={this.props.history} />
      </div>
    );
  }
}

export default withRouter(Login);