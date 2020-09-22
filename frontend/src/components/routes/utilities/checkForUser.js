import { isFuture } from 'date-fns';
import getNewAccessToken from './getNewAccessToken';

async function checkForUser() {
  if (!window.localStorage.getItem('access')) return false;

  const expiration = Date.parse(window.localStorage.getItem('expiration'));
  var accessToken;
  if (isFuture(expiration)) {
    accessToken = window.localStorage.getItem('access');
  } else {
    accessToken = await getNewAccessToken();
  };

  if (accessToken) {
    return true;
  } else {
    return false;
  };
};

export default checkForUser;