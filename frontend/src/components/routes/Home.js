import React, { Component } from "react";
import { render } from "react-dom";
import "core-js/stable";
import "regenerator-runtime/runtime";
import { isBefore } from "date-fns";
import getNewAccessToken from "./utilities/getNewAccessToken";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loaded: false,
      placeholder: "Loading"
    };
  }

  async componentDidMount() {
    // check if access token needs refresh
    const expiration = Date.parse(window.localStorage.getItem('expiration'));
    var accessToken;
    if (isBefore(new Date(), expiration)) {
      accessToken = window.localStorage.getItem('access');
    } else {
      accessToken = await getNewAccessToken();
    };

    const requestOptions = {
      headers: { 'Authorization': 'Bearer ' + window.localStorage.getItem('access') }
    }
    fetch("api/account/get-users", requestOptions)
      .then(response => {
        if (response.status > 400) { // generate new access code and try again
          getNewAccessToken()
          .then(() => {
            requestOptions = { headers: { 'Authorization': 'Bearer ' + accessToken }};
            fetch('api/account/check-user-profile', requestOptions)
              .then(response => {
                console.log(response);
                if (response.status > 400) {
                  this.props.history.push('/login');
                  return;
                }
                return response.json();
              });
          })
        } else {
          return response.json();
        };
      })

      .then(data => {
        console.log(data);
        this.setState(() => {
          return {
            data,
            loaded: true
          };
        });
      });
  }

  render() {
    return (
        <ul>
          {this.state.data.map(user => {
            return (
              <li key={user.id}>
                {user.first_name} - {user.bio}
              </li>
            );
          })}
        </ul>
    );
  }
}

export default Home;