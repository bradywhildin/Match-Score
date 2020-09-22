import React, { Component } from 'react';
import { render } from 'react-dom';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { isFuture } from 'date-fns';
import NavBar from './NavBar';
import checkForUser from './utilities/checkForUser';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loaded: false,
      placeholder: 'Loading'
    };
  }

  async componentDidMount() {
    const userLoggedIn = await checkForUser();
    if (!userLoggedIn) {
      this.props.history.push('/login');
      return;
    };


    const requestOptions = {
      headers: { 'Authorization': 'Bearer ' + window.localStorage.getItem('access') }
    }
    fetch('api/account/get-users', requestOptions)
      .then(response => {
          return response.json();
      })
      .then(data => {
        console.log(data);
        this.setState(() => {
          return {
            data,
            loaded: true
          };
        });
      })
  }

  render() {
    return (
      <div>
        <NavBar current="home" loggedIn={true} />
        <ul>
          {this.state.data.map(user => {
            return (
              <li key={user.id}>
                {user.first_name} - {user.bio}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

export default Home;