import React, { Component } from 'react';
import { render } from 'react-dom';
import { withRouter } from 'react-router-dom';
import Cookies from 'js-cookie';
import NavBar from './NavBar';
import { Form, Checkbox, TextArea, Header, Divider } from 'semantic-ui-react';

class CreateAccountForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      username: '',
      password:''
    };

    this.handleChangeFirstName = this.handleChangeFirstName.bind(this);
    this.handleChangeUsername = this.handleChangeUsername.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.loginUser = this.loginUser.bind(this);
  }

  handleChangeFirstName(e, {value}) {
    this.setState({ firstName: {value}.value });
  }

  handleChangeUsername(e, {value}) {
    console.log({value}.value);
    this.setState({ username: {value}.value });
  }

  handleChangePassword(e, {value}) {
    this.setState({ password: {value}.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    const requestOptions = {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-CSRF-Token': Cookies.get('csrftoken')
      },
      body: JSON.stringify({
        first_name: this.state.firstName,
        last_name: this.state.lastName,
        username: this.state.username,
        password: this.state.password
      })
    };
    fetch('api/account/create-user', requestOptions)
      .then(response => {
        if (response.status > 400) {
          alert('Account Creation Failed');
          return;
        };
        this.loginUser();
      });
  }

  loginUser() {
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
        return response.json();
      })
      .then(data => {
        console.log(data);
        window.localStorage.setItem('access', data.access);
        window.localStorage.setItem('refresh', data.refresh);
        this.props.history.push('/home');
      });
  }

  render() {
    return (
      <Form onSubmit={this.handleSubmit} className="userForm">
        <Form.Input label="First Name" onChange={this.handleChangeFirstName} />
        <Form.Input label="Username" onChange={this.handleChangeUsername} />
        <Form.Input label="Password" onChange={this.handleChangePassword} type="password" />
        <Form.Button className="formSubmit">Create Account</Form.Button>
      </Form>
    )
  }
}

class CreateAccount extends Component {
  render() {
    return (
      <div>
        <NavBar current="createAccount" loggedIn={false} />
        <CreateAccountForm history={this.props.history} />
      </div>
    )
  }
}

export default withRouter(CreateAccount);