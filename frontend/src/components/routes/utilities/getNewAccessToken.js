function getNewAccessToken(props) {
  const requestOptions = {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      refresh: window.localStorage.getItem('refresh')
    })
  };
  fetch("api/token/refresh", requestOptions)
    .then(response => {
      if (response.status > 400) {
        props.history.push('/login');
      } else {
        return response.json();
      };
    })
    .then(data => {
      console.log(data);
      window.localStorage.setItem('access', data.access);
    })
}