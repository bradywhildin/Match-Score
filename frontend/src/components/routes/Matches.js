import React, { Component } from 'react';
import NavBar from './NavBar';
import { Card, Button, Form, Comment, Header, Image } from 'semantic-ui-react';
import checkForUser from './utilities/checkForUser';
import checkForProfile from './utilities/checkForProfile';
import UserCard from './utilities/UserCard'
import { ChatFeed, Message } from 'react-chat-ui'
import getUserId from './utilities/getUserId';

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
      matchImage: null,
      matchName: null,
    };

    this.handleResize = this.handleResize.bind(this);
    this.handleChat = this.handleChat.bind(this);
    this.returnToMatches = this.returnToMatches.bind(this);
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
      matchImage: e.target.getAttribute('image'),
      matchName: e.target.name,
    });
  }

  returnToMatches() {
    this.setState({
      chatMode: false,
      matchId: null,
      matchImage: null,
      matchName: null,
    })
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
          <Chat matchId={this.state.matchId} matchImage={this.state.matchImage} matchName={this.state.matchName} returnToMatches={this.returnToMatches} />
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
      newMessageContent: '',
      messages: [],
      userId: null,
    }

    this.scrollToBottom = this.scrollToBottom.bind(this);
    this.setMessages = this.setMessages.bind(this);
    this.handleChangeMessage = this.handleChangeMessage.bind(this);
    this.handleMessageSend = this.handleMessageSend.bind(this);
  }

  async componentDidMount() {
    getUserId().then(userId => {
      this.setState({
        userId: userId,
      });
      this.setMessages();

      this.scrollToBottom();
    })
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  // scroll to bottom of chat messages
  scrollToBottom() {
    var messages = document.getElementById('messages');
    messages.scrollTop = messages.scrollHeight;
  }

  // get messages from backend and put in state
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
        // reset messages to empty list
        this.setState({
          messages: [],
        })

        chatData.forEach(message => {
          let id;

          // figure out if message is from current user; id is 0 if yes, 1 if no
          if (message.author.id == this.state.userId) {
            id = 0;
          } else {
            id = 1;
          }

          let messages = [...this.state.messages];
          messages.push(
            new Message({
              id: id,
              message: message.content,
              senderName: message.author.name,
            })
          );

          this.setState({
            messages: messages
          });
        });
      });
  }

  handleChangeMessage(e, {value}) {
    this.setState({ newMessageContent: {value}.value });
  }

  async handleMessageSend() {
    const userLoggedIn = await checkForUser();
    if (!userLoggedIn) {
      this.props.history.push('/login');
      return;
    };

    const requestOptions = {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + window.localStorage.getItem('access'),
      },
      body: JSON.stringify({ 
        'content': this.state.newMessageContent,
        'match_id': this.props.matchId,
      }),
    };
    fetch('api/chat/add-message', requestOptions)
      .then(response => {
        this.setState({
          newMessageContent: '',
        });
        this.setMessages();
      });
  }

  render() {
    return (
      <div className="chat">
        <Button basic color="blue" onClick={this.props.returnToMatches} id="returnToMatchesButton">
          Return to matches
        </Button>

        <Header as='h1' textAlign="center">
          <Image circular src={this.props.matchImage} /> 
          {this.props.matchName}
        </Header>

        <div className="scrollable" id="messages">
          <ChatFeed
            messages={this.state.messages} // Array: list of message objects
            isTyping={false}
            hasInputField={false}
            showSenderName // show the name of the user who sent the message
            bubblesCentered={false} //Boolean should the bubbles be centered in the feed?
            // JSON: Custom bubble styles
            bubbleStyles={
              {
                text: {
                  fontSize: 15
                },
                chatbubble: {
                  borderRadius: 30,
                  padding: 10
                }
              }
            }
          />
        </div>

        <Form onSubmit={this.handleMessageSend}>
          <Form.Input label="New Message" value={this.state.newMessageContent} onChange={this.handleChangeMessage} />
          <Form.Button className="formSubmit">Send</Form.Button>
        </Form>
    </div>
    );
  }
}


export default Matches;