import axios from 'axios'

import {ClientId, ClientSecret} from '../Credentials'

const getToken  = async () => {
await axios('https://accounts.spotify.com/api/token', {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Basic ' + btoa(ClientId + ':' + ClientSecret)
  },
  data: 'grant_type=client_credentials',
  method: 'POST'
})
.then(tokenResponse => {
  console.log(tokenResponse.data.access_token);
  return tokenResponse.data.access_token
}).catch(err => {
  console.log(ClientSecret)
  console.log({err: err.response})
})
}



export {getToken}
