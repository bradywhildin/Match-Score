import React, { Component } from 'react'
import { render } from 'react-dom'
import { withRouter } from 'react-router-dom'
import Cookies from 'js-cookie'
import { Form, Checkbox, TextArea, Header, Divider } from 'semantic-ui-react';
import checkForUser from './utilities/checkForUser';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { isFuture } from 'date-fns';
import NavBar from './NavBar';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasProfile: false,
      zip: '',
      bio: '',
      a1: null,
      a2: null,
      a3: null,
      a4: null,
      a5: null,
      message: '',
    };
    this.handleChangeZip = this.handleChangeZip.bind(this);
    this.handleChangeBio = this.handleChangeBio.bind(this);
    this.handleChangeA1 = this.handleChangeA1.bind(this);
    this.handleChangeA2 = this.handleChangeA2.bind(this);
    this.handleChangeA3 = this.handleChangeA3.bind(this);
    this.handleChangeA4 = this.handleChangeA4.bind(this);
    this.handleChangeA5 = this.handleChangeA5.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    if (!checkForUser()) this.props.history.push('/login');
    
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
            zip: data.profile.zip,
            bio: data.profile.bio,
            a1: data.profile.a1.toString(),
            a2: data.profile.a2.toString(),
            a3: data.profile.a3.toString(),
            a4: data.profile.a4.toString(),
            a5: data.profile.a5.toString(),
          });
        }
      })
  }

  handleChangeZip(e) {
    this.setState({ zip: e.target.value });
  }
  handleChangeBio(e, {value}) {
    this.setState({ bio: {value}.value });
  }
  handleChangeA1(e, {value}) {
    this.setState({ a1: {value}.value });
  }
  handleChangeA2(e, {value}) {
    this.setState({ a2: {value}.value });
  }
  handleChangeA3(e, {value}) {
    this.setState({ a3: {value}.value });
  }
  handleChangeA4(e, {value}) {
    this.setState({ a4: {value}.value });
  }
  handleChangeA5(e, {value}) {
    this.setState({ a5: {value}.value });
  }

  async handleSubmit(e) {
    if (!checkForUser()) this.props.history.push('/login');

    // check if access token needs refresh
    const expiration = Date.parse(window.localStorage.getItem('expiration'));
    var accessToken;
    if (isFuture(expiration)) {
      accessToken = window.localStorage.getItem('access');
    } else {
      accessToken = await getNewAccessToken();
    };

    if (!accessToken) this.props.history.push('/login');

    // update or create profile
    var method, url, message;
    if (this.state.hasProfile) {
      method = 'PUT';
      url = 'api/account/update-profile';
      message = 'Your profile has been updated.'
    }
    else {
      method = 'POST';
      url = 'api/account/create-profile';
      message = 'Your profile has been created.'
    };

    const requestOptions = {
      method: method,
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      },
      body: JSON.stringify({
        zip: this.state.zip,
        bio: this.state.bio,
        a1: parseInt(this.state.a1),
        a2: parseInt(this.state.a2),
        a3: parseInt(this.state.a3),
        a4: parseInt(this.state.a4),
        a5: parseInt(this.state.a5),
      })
    };

    fetch(url, requestOptions)
      .then(() => {
        this.setState({
          message: message
        })
      })
  }

  render() {
    return (
      <div>
        <NavBar current="profile" loggedIn={true} />

        <div className="userForm">
          <h1 className="profileItem">Profile Settings</h1>

          <Form onSubmit={this.handleSubmit}>
            <Zip zip={this.state.zip} handleChange={this.handleChangeZip} />
            <Bio bio={this.state.bio} handleChange={this.handleChangeBio} />
            <br />
            <Q1 a={this.state.a1} handleChange={this.handleChangeA1} />
            <Divider />
            <Q2 a={this.state.a2} handleChange={this.handleChangeA2} />
            <Divider />
            <Q3 a={this.state.a3} handleChange={this.handleChangeA3} />
            <Divider />
            <Q4 a={this.state.a4} handleChange={this.handleChangeA4} />
            <Divider />
            <Q5 a={this.state.a5} handleChange={this.handleChangeA5} />
            <Divider />
            <Form.Button className="formSubmit">Save</Form.Button>
          </Form>

          <p>{this.state.message}</p>
        </div>
      </div>
    )
  }
}

function Bio(props) {
  return (
    <div id="bio" className="profileItem">
      <Form.Field>
        <label className="profileLabel">Bio</label>
        <TextArea
          label="Bio"
          placeholder="Enter a bio"
          value={props.bio}
          onChange={props.handleChange}
        />
      </Form.Field>
    </div>
  )
}

function Zip(props) {
  return (
    <div id="zip" className="profileItem">
      <Form.Field>
        <label className="profileLabel">Zip Code</label>
        <input 
          placeholder='Enter your zip code'
          value={props.zip}
          onChange={props.handleChange}
        />
      </Form.Field>
    </div>
  )
}

function Q1(props) {
  return (
    <div className="profileItem">
      <Header as="h4">What are you looking for on this site?</Header>
      <Form.Field>
        <Checkbox
          radio
          label="Attention/Validation"
          value="10"
          checked={props.a == '10'}
          onChange={props.handleChange}
        />
      </Form.Field>
      <Form.Field>
        <Checkbox
          radio
          label="One night stand"
          value="8"
          checked={props.a == '8'}
          onChange={props.handleChange}
        />
      </Form.Field>
      <Form.Field>
        <Checkbox
          radio
          label="Probably just a fling"
          value="6"
          checked={props.a == '6'}
          onChange={props.handleChange}
        />
      </Form.Field>
      <Form.Field>
        <Checkbox
          radio
          label="Open to anything but slightly prefer something without any eventual commitment"
          value="5"
          checked={props.a == '5'}
          onChange={props.handleChange}
        />
      </Form.Field>
      <Form.Field>
        <Checkbox
          radio
          label="Open to anything but slightly prefer something long term"
          value="3"
          checked={props.a == '3'}
          onChange={props.handleChange}
        />
      </Form.Field>
      <Form.Field>
        <Checkbox
          radio
          label="Long term relationship"
          value="1"
          checked={props.a == '1'}
          onChange={props.handleChange}
        />
      </Form.Field>
      <Form.Field>
        <Checkbox
          radio
          label="Husband/Wife"
          value="0"
          checked={props.a == '0'}
          onChange={props.handleChange}
        />
      </Form.Field>
    </div>
  );
}

function Q2(props) {
  return (
    <div className="profileItem">
      <Header as="h4">Do you want a dog?</Header>
      <Form.Field>
        <Checkbox
          radio
          label="Yes, definitely"
          value="4"
          checked={props.a == '4'}
          onChange={props.handleChange}
        />
      </Form.Field>
      <Form.Field>
        <Checkbox
          radio
          label="Yes, as long as it's low energy or I don't have to take care of it alone"
          value="3"
          checked={props.a == '3'}
          onChange={props.handleChange}
        />
      </Form.Field>
      <Form.Field>
        <Checkbox
          radio
          label="Doesn't matter to me"
          value="2"
          checked={props.a == '2'}
          onChange={props.handleChange}
        />
      </Form.Field>
      <Form.Field>
        <Checkbox
          radio
          label="Only if I don't have to take care of it"
          value="1"
          checked={props.a == '1'}
          onChange={props.handleChange}
        />
      </Form.Field>
      <Form.Field>
        <Checkbox
          radio
          label="No, keep those filthy animals away from me"
          value="0"
          checked={props.a == '0'}
          onChange={props.handleChange}
        />
      </Form.Field>
    </div>
  );
}

function Q3(props) {
  return (
    <div className="profileItem">
      <Header as="h4">Which of these do you value most in a friendship?</Header>
      <Form.Field>
        <Checkbox
          radio
          label="Loyalty"
          value="2"
          checked={props.a == '2'}
          onChange={props.handleChange}
        />
      </Form.Field>
      <Form.Field>
        <Checkbox
          radio
          label="Honesty"
          value="1"
          checked={props.a == '1'}
          onChange={props.handleChange}
        />
      </Form.Field>
      <Form.Field>
        <Checkbox
          radio
          label="Fun"
          value="0"
          checked={props.a == '0'}
          onChange={props.handleChange}
        />
      </Form.Field>
    </div>
  );
}

function Q4(props) {
  return (
    <div className="profileItem">
      <Header as="h4">To your left, you see an elderly couple drowning. To your right, you see a baby drowning. Which do you save?</Header>
      <Form.Field>
        <Checkbox
          radio
          label="Baby"
          value="2"
          checked={props.a == '2'}
          onChange={props.handleChange}
        />
      </Form.Field>
      <Form.Field>
        <Checkbox
          radio
          label="Elderly Couple"
          value="0"
          checked={props.a == '0'}
          onChange={props.handleChange}
        />
      </Form.Field>
      <Form.Field>
        <Checkbox
          radio
          label="Try to save both but end up drowning and saving no one"
          value="1"
          checked={props.a == '1'}
          onChange={props.handleChange}
        />
      </Form.Field>
    </div>
  );
}

function Q5(props) {
  return (
    <div className="profileItem">
      <Header as="h4">Which of these areas would you most like to settle down in?</Header>
      <Form.Field>
        <Checkbox
          radio
          label="City"
          value="2"
          checked={props.a == '2'}
          onChange={props.handleChange}
        />
      </Form.Field>
      <Form.Field>
        <Checkbox
          radio
          label="Suburb"
          value="1"
          checked={props.a == '1'}
          onChange={props.handleChange}
        />
      </Form.Field>
      <Form.Field>
        <Checkbox
          radio
          label="Rural"
          value="0"
          checked={props.a == '0'}
          onChange={props.handleChange}
        />
      </Form.Field>
    </div>
  );
}

export default Profile;        