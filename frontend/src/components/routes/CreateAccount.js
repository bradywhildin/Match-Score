import React, { Component } from "react";
import { render } from "react-dom";
import { withRouter } from "react-router-dom"
import Cookies from "js-cookie"

class CreateAccountForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      username: '',
      password:''
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.loginUser = this.loginUser.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
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
    fetch("api/account/create-user", requestOptions)
      .then(response => {
        if (response.status > 400) {
          alert('Account Creation Failed')
          return
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
    fetch("api/token/", requestOptions)
      .then(response => {
        return response.json();
      })
      .then(data => {
        console.log(data);
        window.localStorage.setItem('access', data.access);
        window.localStorage.setItem('refresh', data.refresh);
        this.props.history.push('/home');
      })
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            First Name:
            <input type="text" onChange={(event) => this.setState({ firstName : event.target.value })} />
          </label>
          <label>
            Last Name:
            <input type="text" onChange={(event) => this.setState({ lastName : event.target.value })} />
          </label>
          <label>
            Username:
            <input type="text" onChange={(event) => this.setState({ username : event.target.value })} />
          </label>
          <label>
            Password:
            <input type="password" onChange={(event) => this.setState({ password : event.target.value })} />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    )
  }
}

class CreateAccount extends Component {
  render() {
    return (
      <div>
        <h1>Create Account</h1>
        <CreateAccountForm history={this.props.history} />
      </div>
    )
  }
}

export default withRouter(CreateAccount)