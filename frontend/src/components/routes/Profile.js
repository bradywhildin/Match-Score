import React, { Component } from "react";
import { render } from "react-dom";
import { withRouter } from "react-router-dom"
import Cookies from "js-cookie"

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bio: '',
      message: '',
      hasProfile: 0
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const requestOptions = {
      method : 'GET',
      headers: { 
        'Authorization': 'Bearer ' + window.localStorage.getItem('access') 
      }
    };
    // determine if user already has profile
    fetch('api/account/check-user-profile', requestOptions)
      .then(response => {
        return response.json();
      })
      .then(data => {
        if (data.has_profile) {
          // fill in text boxes with current data
          this.setState({
            hasProfile: true,
            bio: data.profile.bio
          });
        }
        else {
          this.setState({
            hasProfile: false
          });
        };
      });
  }

  handleSubmit(event) {
    event.preventDefault();
    // update or create profile
    if (this.state.hasProfile == 1) {
      const requestOptions = {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + window.localStorage.getItem('access')
        },
        body: JSON.stringify({
          bio: this.state.bio 
        })
      };
      fetch('api/account/update-profile', requestOptions)
        .then(() => {
          this.setState({
            message: 'Your profile has been updated.'
          })
        });
    }
    else {
      const requestOptions = {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + window.localStorage.getItem('access') 
        },
        body: JSON.stringify({
          bio: this.state.bio 
        })
      };
      fetch('api/account/create-profile', requestOptions)
        .then(() => {
          this.setState({
            message: 'Your profile has been created.'
          });
        });
    }
  }

  render() {
    return (
      <div>
        <h1>Profile Settings</h1>
        <form onSubmit={this.handleSubmit}>
          <label>
            Bio:
            <input type="text" value={this.state.bio} onChange={(event) => this.setState({ bio : event.target.value })} />
          </label>
          <input type="submit" value="Submit" />
        </form>
        <p>{this.state.message}</p>
      </div>
    )
  }
}

export default Profile