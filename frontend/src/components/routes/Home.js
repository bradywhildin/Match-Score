import React, { Component } from "react";
import { render } from "react-dom";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loaded: false,
      placeholder: "Loading"
    };
  }

  componentDidMount() {
    const requestOptions = {
      headers: { 'Authorization': 'Bearer ' + window.localStorage.getItem('access') }
    }
    fetch("api/account/", requestOptions)
      .then(response => {
        if (response.status > 400) {
          this.setState({
            placeholder: "Something went wrong!"
          });
          this.props.history.push('/login')
        }
        return response.json();
      })
      .then(data => {
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
              {user.username}
            </li>
          );
        })}
      </ul>
    );
  }
}

export default Home;