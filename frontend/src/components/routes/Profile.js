import React, { Component } from 'react'
import { render } from 'react-dom'
import { withRouter } from 'react-router-dom'
import Cookies from 'js-cookie'
import { Form, Checkbox, TextArea, Header, Divider, Message } from 'semantic-ui-react';
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
      imageFile: null,
      imageUrl: '',
      zip: '',
      bio: '',
      a1: null,
      a2: null,
      a3: null,
      a4: null,
      a5: null,
      message: '',
      imageUpdated: false,
      invalidInput: false,
    };

    this.fillProfile = this.fillProfile.bind(this);
    this.handleChangeImageFile = this.handleChangeImageFile.bind(this);
    this.handleChangeZip = this.handleChangeZip.bind(this);
    this.handleChangeBio = this.handleChangeBio.bind(this);
    this.handleChangeA1 = this.handleChangeA1.bind(this);
    this.handleChangeA2 = this.handleChangeA2.bind(this);
    this.handleChangeA3 = this.handleChangeA3.bind(this);
    this.handleChangeA4 = this.handleChangeA4.bind(this);
    this.handleChangeA5 = this.handleChangeA5.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validInput = this.validInput.bind(this);
  }

  async componentDidMount() {
    if (!(await checkForUser())) this.props.history.push('/login');
    
    this.fillProfile();
  }

  // fill out profile with existing details if profile exists
  fillProfile() {
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
            imageUrl: data.profile.image,
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

  handleChangeImageFile(e) {
    e.preventDefault();
    this.setState({ 
      imageFile: e.target.files[0],
      imageUrl: URL.createObjectURL(e.target.files[0]),
      imageUpdated: true,
    });
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
    e.preventDefault();
    if (!checkForUser()) this.props.history.push('/login');

    if (!this.validInput()) {
      this.setState({
        invalidInput: true,
      })
      return;
    };

    this.setState({
      invalidInput: false,
    });

    var url = 'api/account/get-coordinates?zip=' + this.state.zip;
    const response = await fetch(url);
    if (response.ok) {
      var coord = await response.json();
    } else {
      alert('Error finding coordinates');
      return;
    };

    // update or create profile
    var method, message;
    if (this.state.hasProfile) {
      method = 'PUT';
      url = 'api/account/update-profile';
      message = 'Your profile has been updated.'
    } else {
      method = 'POST';
      url = 'api/account/create-profile';
      message = 'Your profile has been created.'
    };

    var formData = new FormData();
    formData.append('zip', this.state.zip);
    formData.append('bio', this.state.bio);
    formData.append('latitude', coord.latitude);
    formData.append('longitude', coord.longitude);
    formData.append('a1', parseInt(this.state.a1));
    formData.append('a2', parseInt(this.state.a2));
    formData.append('a3', parseInt(this.state.a3));
    formData.append('a4', parseInt(this.state.a4));
    formData.append('a5', parseInt(this.state.a5));

    // only upload image if user updated it
    if (this.state.imageUpdated) {
      formData.append('image', this.state.imageFile);
    };

    const requestOptions = {
      method: method,
      headers: { 
        'Authorization': 'Bearer ' + window.localStorage.getItem('access')
      },
      body: formData
    };

    fetch(url, requestOptions)
      .then(() => {
        this.setState({
          message: message
        })
      });
  }

  // makes sure all fields are filled out
  validInput() {
    if (!(this.state.zip.length > 0 && this.state.bio.length > 0)) {
      return false;
    };

    if (!this.state.hasProfile && (!(this.state.a1 != null &&  this.state.a2 != null && this.state.a3 != null && this.state.a4 != null && this.state.a5 != null && this.state.imageFile != null))) {
      return false
    } else if (this.state.imageUpdated && this.state.imageFile == null) {
      return false
    };

    return true;
  }

  render() {
    return (
      <div>
        <NavBar current="profile" loggedIn={true} />

        <div className="userForm">
          <Form error onSubmit={this.handleSubmit}>
            <ImageUpload imageFile={this.state.imageFile} imageUrl={this.state.imageUrl} handleChange={this.handleChangeImageFile} />
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

            {this.state.invalidInput && 
              <Message
                error
                header="Please choose picture and fill out all fields"
              />
            }

            <Form.Button className="formSubmit">Save</Form.Button>
          </Form>

          <p>{this.state.message}</p>
        </div>
      </div>
    )
  }
}

function ImageUpload(props) {
  const fileInputRef = React.createRef();
  return (
    <div className="profileItem">
      <Form.Field>
        <label className="profileLabel">Profile Picture</label>
        <img id="profileImage" src={props.imageUrl} />
        {/* <Button
          content="Choose Picture"
          labelPosition="left"
          icon="file image"
          onClick={() => fileInputRef.current.click()}
        /> */}
        <input
          ref={fileInputRef}
          type="file"
          onChange={props.handleChange}
        />
      </Form.Field>
    </div>
  )
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