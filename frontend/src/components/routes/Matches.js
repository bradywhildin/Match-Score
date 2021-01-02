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
      userData: [],
      loaded: false,
      placeholder: 'Loading',
      itemsPerRow: itemsPerRow,
      noProfile: false,
      noMatches: false,
      chatMode: false,
      matchId: null,
    };

    this.handleResize = this.handleResize.bind(this);
    this.handleChat = this.handleChat.bind(this);
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
          .then(userData => {
            this.setState({
              userData: userData,
              loaded: true,
            });

            if (userData.length == 0) { // let user know if they don't have any matches
              this.setState({
                noMatches: true,
              });
            };
          });
      } else {
        this.setState({
          noProfile: true,
        });
      };
    });
  }

  async handleChat(e) {
    e.persist();

    const userLoggedIn = await checkForUser();
    if (!userLoggedIn) {
      this.props.history.push('/login');
      return;
    };

    this.setState({
      chatMode: true,
      matchId: e.target.value,
    });
  }

  render() {
    return (
      <div>
        <NavBar current="matches" loggedIn={true} />

        {this.state.noProfile &&
          <h4>You must create profile to start matching.</h4>
        }

        {this.state.noMatches &&
          <h4>You don't have any matches yet.</h4>
        }

        {!this.state.chatMode &&
          <Card.Group id="cardGroup" itemsPerRow={this.state.itemsPerRow} centered={true}>
            {this.state.userData.map(user => {
              return (
                <UserCard 
                  key={user.id} 
                  image={user.image} 
                  firstName={user.first_name}
                  matchScore={user.match_score} 
                  distance={user.distance} 
                  bio={user.bio}
                  id={user.match_id}
                  showMatchButtons={false}
                  showChatButton={true}
                  handleChat={this.handleChat}
                />
              );
            })}
          </Card.Group>
        }

        {this.state.chatMode &&
          <Chat matchId={this.state.matchId} />
        }

      </div>
    );
  }
}


class Chat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      chatData: [],
    }

    this.setMessages = this.setMessages.bind(this);
  }

  async componentDidMount() {
    const userLoggedIn = await checkForUser();
    if (!userLoggedIn) {
      this.props.history.push('/login');
      return;
    };

    this.setMessages();
  }

  async setMessages() {
    const requestOptions = {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + window.localStorage.getItem('access'),
      }
    };

    const url = 'api/chat/get-messages?match_id=' + this.props.matchId;

    fetch(url, requestOptions)
      .then(response => {
        return response.json();
      })
      .then(chatData => {
        console.log(chatData);
        this.setState({
          chatData: chatData
        });
      });
  }

  render() {
    return (
      <ul>
        {this.state.chatData.map(message => {
            return (
              <li key={message.id}>{message.content} - {message.author.name} - {message.time}</li>
            );
          })}
      </ul>
    );
  }
}


export default Matches;