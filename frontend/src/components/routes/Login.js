import React, { Component } from 'react';
import { render } from 'react-dom';
import { withRouter } from 'react-router-dom'
import Cookies from 'js-cookie'
import { add } from 'date-fns'
import NavBar from './NavBar';
import { Form, Message } from 'semantic-ui-react';

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      incorrectInput: false,
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
        if (response.status >= 400) {
          this.setState({
            username: '',
            password: '',
            incorrectInput: true,
          });
          throw new Error('Wrong Username/Password');
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
      <Form error onSubmit={this.handleSubmit} className="userForm">
        <Form.Input label="Username" value={this.state.username} onChange={this.handleChangeUsername} />
        <Form.Input label="Password" value={this.state.password} onChange={this.handleChangePassword} type="password" />

        {this.state.incorrectInput && 
          <Message
            error
            header="Incorrect Username/Password"
            content="Try again."
          />
        }

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