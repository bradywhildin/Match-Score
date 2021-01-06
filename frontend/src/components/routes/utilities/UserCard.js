import React from 'react';
import { Card, Button, Image } from 'semantic-ui-react';

function MatchButtons(props) {
  return (
    <Card.Content extra>
      <div className='ui two buttons'>
        <Button basic color='green' onClick={props.handleMatch} value={props.id}>
          Match
        </Button>
        <Button basic color='red' onClick={props.handleBlock} value={props.id}>
          Block
        </Button>
      </div>
    </Card.Content>
  );
}

function ChatButton(props) {
  return (
    <Card.Content extra>
      <div className='ui two buttons'>
        <Button basic color='blue' onClick={props.handleChat} value={props.id} image={props.image} name={props.name} >
          Chat
        </Button>
      </div>
    </Card.Content>
  );
}

function UserCard(props) {
  return(
    <Card>
      <Image src={props.image} wrapped ui={false} />
      <Card.Content>
        <Card.Header>{props.firstName}</Card.Header>
        <Card.Meta>Match Score: {props.matchScore}/20</Card.Meta>
        <Card.Meta>Within {props.distance} miles</Card.Meta>
        <Card.Description>
          {props.bio}
        </Card.Description>
      </Card.Content>

      {props.showMatchButtons &&
        <MatchButtons id={props.id} handleMatch={props.handleMatch} handleBlock={props.handleBlock} />
      }

      {props.showChatButton && 
        <ChatButton id={props.id} handleChat={props.handleChat} image={props.image} name={props.firstName} />
      }
    </Card>
  );
}

export default UserCard;