import React, { Component } from 'react';
import { render } from 'react-dom';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { isFuture } from 'date-fns';
import NavBar from './NavBar';
import checkForUser from './utilities/checkForUser';
import { Card, Button } from 'semantic-ui-react';

class Home extends Component {
  constructor(props) {
    super(props);
    const itemsPerRow = (window.innerWidth > 1000) ? 3 : 2;
    this.state = {
      data: [],
      loaded: false,
      placeholder: 'Loading',
      itemsPerRow: itemsPerRow,
    };

    this.handleResize = this.handleResize.bind(this);
  }

  handleResize() {
    const itemsPerRow = (window.innerWidth > 1000) ? 3 : 2;
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
        <Card.Group id="cardGroup" itemsPerRow={this.state.itemsPerRow} centered={true}>
          {this.state.data.map(user => {
            return (
              <Card key={user.id}>
                <Card.Content>
                  <Card.Header>{user.first_name}</Card.Header>
                  <Card.Meta>Match Score: {user.match_score}/20</Card.Meta>
                  <Card.Description>{user.bio}</Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <div className='ui two buttons'>
                    <Button basic color='green'>
                      Match
                    </Button>
                    <Button basic color='red'>
                      Block
                    </Button>
                  </div>
                </Card.Content>
              </Card>
            );
          })}
        </Card.Group>
      </div>
    );
  }
}

export default Home;