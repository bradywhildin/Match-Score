import React, { Component } from "react";
import { render } from "react-dom";
import { withRouter } from "react-router-dom"
import Cookies from "js-cookie"

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };

    this.handleSubmit = this.handleSubmit.bind(this);
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
    fetch("api/token/", requestOptions)
      .then(response => {
        if (response.status > 400) {
          alert('Wrong email/password')
        };
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
            Username:
            <input type="text" onChange={(e) => this.setState({ username : e.target.value })} />
          </label>
          <label>
            Password:
            <input type="password" onChange={(e) => this.setState({ password : e.target.value })} />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    )
  }
}

class Login extends Component {
  render() {
    return (
      <div>
        <h1>Login</h1>
        <LoginForm history={this.props.history} />
      </div>
    );
  }
}

export default withRouter(Login);