import React, { Component } from 'react';
import NavBar from './NavBar';
import { Card } from 'semantic-ui-react';
import checkForUser from './utilities/checkForUser';
import checkForProfile from './utilities/checkForProfile';
import UserCard from './utilities/UserCard'

class Matches extends Component {
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
      noProfile: false,
    };

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

    // make sure user has profile before trying to show matches
    checkForProfile().then(hasProfile => {
      if (hasProfile) {
        const requestOptions = {
          headers: { 'Authorization': 'Bearer ' + window.localStorage.getItem('access') }
        };
        fetch('api/match/get-matches', requestOptions)
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
      } else {
        this.setState({
          noProfile: true,
        });
      };
    });
  }

  render() {
    return (
      <div>
        <NavBar current="matches" loggedIn={true} />

        {this.state.noProfile &&
          <h4>You must create profile to start matching.</h4>
        }

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
                showButtons={false}
              />
            );
          })}
        </Card.Group>
      </div>
    );
  }
}

export default Matches;