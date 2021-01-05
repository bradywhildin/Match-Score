import checkForUser from './checkForUser';
 
async function getUserId() {
    const userLoggedIn = await checkForUser();
    if (!userLoggedIn) {
      this.props.history.push('/login');
      return -1;
    };

    const requestOptions = {
      headers: { 'Authorization': 'Bearer ' + window.localStorage.getItem('access') }
    };
    return fetch('api/account/get-user-id', requestOptions)
      .then(response => {
          return response.json();
      })
      .then(data => {
          return data.id;
      });
}

export default getUserId;