import { add } from "date-fns"

function getNewAccessToken() {
  if (!window.localStorage.getItem('refresh')) {
    return false;
  };

  const requestOptions = {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      refresh: window.localStorage.getItem('refresh')
    })
  };

  return (
    fetch("api/token/refresh/", requestOptions)
      .then(response => {
        return response.json();
      })
      .then(data => {
        console.log(data);
        const expiration = add(new Date, { minutes: 4, seconds: 30 });
        window.localStorage.setItem('access', data.access);
        window.localStorage.setItem('expiration', expiration);
        return data.access;
      })
  );
}

export default getNewAccessToken;