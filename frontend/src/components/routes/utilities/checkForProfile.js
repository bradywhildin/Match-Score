async function checkForProfile() {
    const hasProfile = null;
    const requestOptions = {
        headers: { 'Authorization': 'Bearer ' + window.localStorage.getItem('access') }
      };
      return fetch('api/account/check-user-profile', requestOptions)
        .then(response => {
            return response.json();
        })
        .then(data => {
            return data.has_profile;
        });
}

export default checkForProfile;