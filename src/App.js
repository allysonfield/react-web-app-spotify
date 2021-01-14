import { useEffect, useState } from 'react';
import './App.css';
import Dropdown from './components/Dropdown';
import axios from 'axios';
import { ClientId, ClientSecret } from './services/Credentials';
import Listbox from './components/Listbox';
import Detail from './components/Details';
import { Container } from '@material-ui/core';

function App() {

  const [token, setToken] = useState();
  const [genres, setGenres] = useState({selectedGenre: '', listOfGenresFromAPI: []})
  const [playlist, setPlaylist] = useState({selectedPlaylist: '', listOfPlaylistFromAPI: []})
  const [tracks, setTracks] = useState({selectedTracks: '', listOfTracksFromAPI: []})
  const [trackDetail, setTrackDetail] = useState(null)

  useEffect(() =>{
      axios('https://accounts.spotify.com/api/token', {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Basic ' + btoa(ClientId + ':' + ClientSecret)
  },
  data: 'grant_type=client_credentials',
  method: 'POST'
})
.then(tokenResponse => {
  console.log(tokenResponse.data.access_token);
  setToken(tokenResponse.data.access_token)
  axios.get('https://api.spotify.com/v1/browse/categories?locale=sv_US', {
          headers: {
            'Authorization': `Bearer ${tokenResponse.data.access_token}`
          }
        })
        .then(response => {
          console.log(response.data.categories.items)
          setGenres({
            selectedGenre: genres.selectedGenre,
            listOfGenresFromAPI: response.data.categories.items
          })
        })
})
  }, []);

  const genreChanged = e => {
    setGenres({
      selectedGenre: e,
      listOfGenresFromAPI: genres.listOfGenresFromAPI
    })
    axios(`https://api.spotify.com/v1/browse/categories/${e}/playlists?limit=20`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(response => {
      setPlaylist({
        selectedPlaylist: playlist.selectedPlaylist,
        listOfPlaylistFromAPI: response.data.playlists.items
      })
    }).catch(err => {
      console.log(err)
    })
  }

  const playlistChanged = e => {
    setPlaylist({
      selectedPlaylist: e,
      listOfPlaylistFromAPI: playlist.listOfPlaylistFromAPI
    })
  }

  const buttonClicked = (e) => {
    e.preventDefault();

    axios(`https://api.spotify.com/v1/playlists/${playlist.selectedPlaylist}/tracks?limit=10`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(response => {
      setTracks({
        selectedTracks: tracks.selectedPlaylist,
        listOfTracksFromAPI: response.data.items
      })
    }).catch(err => {
      console.log(err)
    })

  }

  const listboxClicked = (e) => {
    const currentTracks = [...tracks.listOfTracksFromAPI];
    const trackInfo = currentTracks.filter(t => t.track.id === e);
    setTrackDetail(trackInfo[0].track)
  }

  return (
    <Container maxWidth="sm" >
      <form onSubmit={buttonClicked}>
        <div className="App">
          {genres && <Dropdown selected={genres.selectedGenre} label="Gêneros" data={genres.listOfGenresFromAPI} changed={(e)=> {genreChanged(e)}} />}
          {playlist && <Dropdown label="Playlist" data={playlist.listOfPlaylistFromAPI} changed={(e)=> {playlistChanged(e)}} />}
          <button type="submit">Search</button>
          <Listbox items={tracks.listOfTracksFromAPI} clicked={listboxClicked} />
          {trackDetail && <Detail {...trackDetail} />}
        </div>
    </form>
    </Container>
    
    
  );
}

export default App;
