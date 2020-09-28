import React, { Component } from 'react';
import { render } from 'react-dom';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { isFuture } from 'date-fns';
import NavBar from './NavBar';
import checkForUser from './utilities/checkForUser';
import { Card } from 'semantic-ui-react';
import UserCard from './utilities/UserCard';

class Home extends Component {
  constructor(props) {
    super(props);

    var itemsPerRow;
    if (window.innerWidth > 1000) itemsPerRow = 3;
    else if (window.innerWidth > 500) itemsPerRow = 2;
    else itemsPerRow = 1;

    this.state = {
      data: [],
      loaded: false,
      placeholder: 'Loading',
      itemsPerRow: itemsPerRow,
    };

    this.handleMatch = this.handleMatch.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }

  handleResize() {
    var itemsPerRow;
    if (window.innerWidth > 1000) itemsPerRow = 3;
    else if (window.innerWidth > 500) itemsPerRow = 2;
    else itemsPerRow = 1;
  
    this.setState({ itemsPerRow : itemsPerRow });
  }

  async componentDidMount() {
    window.addEventListener('resize', this.handleResize);

    const userLoggedIn = await checkForUser();
    if (!userLoggedIn) {
      this.props.history.push('/login');
      return;
    };

    const requestOptions = {
      headers: { 'Authorization': 'Bearer ' + window.localStorage.getItem('access') }
    };
    fetch('api/account/get-users', requestOptions)
      .then(response => {
          return response.json();
      })
      .then(data => {
        console.log(data);
        this.setState({
          data: data,
          loaded: true,
        });
      });
  }

  // send match request
  async handleMatch(e) {
    e.persist();

    const userLoggedIn = await checkForUser();
    if (!userLoggedIn) {
      this.props.history.push('/login');
      return;
    };

    const id = e.target.value
    const requestOptions = {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + window.localStorage.getItem('access'),
      },
      body: JSON.stringify({ 
        'reciever_id': id 
      }),
    };
    fetch('api/match/make-match-request', requestOptions)
      .then(response => {
        console.log(response);
      });
  }

  render() {
    return (
      <div>
        <NavBar current="home" loggedIn={true} />
        <Card.Group id="cardGroup" itemsPerRow={this.state.itemsPerRow} centered={true}>
          {this.state.data.map(user => {
            return (
              <UserCard 
                key={user.id} 
                image={user.image} 
                firstName={user.first_name}
                matchScore={user.match_score} 
                distance={user.distance} 
                bio={user.bio}
                showButtons={true}
                id={user.id}
                handleMatch={this.handleMatch} 
              />
            );
          })}
        </Card.Group>
      </div>
    );
  }
}

export default Home;