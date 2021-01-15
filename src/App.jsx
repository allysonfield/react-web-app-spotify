import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ThemeProvider } from 'styled-components';
import { Switch } from '@material-ui/core';
import Dropdown from './components/Dropdown';
import Listbox from './components/Listbox';
import Detail from './components/Details';
import './App.css';
import { genre } from './services/filters/genre';
import { playlists } from './services/filters/playlists';
import { track } from './services/filters/tracks';
import { access } from './services/connection';
import { GlobalStyles } from './globalStyles';
import { darkTheme, lightTheme } from './themme';
import { release } from './services/filters/release';
import Slider from './components/Slider';
import { filter } from './services/filters/filter';

function App() {
  const [token, setToken] = useState();
  const [genres, setGenres] = useState({
    selectedGenre: '',
    listOfGenresFromAPI: [],
  });
  const [playlist, setPlaylist] = useState({
    selectedPlaylist: '',
    listOfPlaylistFromAPI: [],
  });
  const [filters, setFilters] = useState([]);
  const [tracks, setTracks] = useState({
    selectedTracks: '',
    listOfTracksFromAPI: [],
  });
  const [trackDetail, setTrackDetail] = useState(null);
  const [releases, setRelease] = useState(null);
  const [theme, setTheme] = useState('dark');

  const themeToggler = () => {
    theme === 'light' ? setTheme('dark') : setTheme('light');
  };
  useEffect(() => {
    async function init() {
      await access().then(async (token) => {
        console.log(token);
        setToken(token);
        localStorage.setItem('tk@spotify', token);

        await genre(token).then(async (genreResponse) => {
          console.log('categorias', genreResponse);
          setGenres({
            selectedGenre: genres.selectedGenre,
            listOfGenresFromAPI: genreResponse.categories.items,
          });
          await playlists(genreResponse.categories.items[0].id, token)
            .then(async (playlistResponse) => {
              setPlaylist({
                selectedPlaylist: playlist.selectedPlaylist,
                listOfPlaylistFromAPI: playlistResponse.playlists.items,
              });
              await track(playlistResponse.playlists.items[0].id, token).then(
                async (trackResponse) => {
                  setTracks({
                    selectedTracks: tracks.selectedPlaylist,
                    listOfTracksFromAPI: trackResponse.items,
                  });
                  const currentTracks = [...trackResponse.items];
                  const trackInfo = currentTracks.filter(
                    (t) => t.id === trackResponse.items[0].id
                  );
                  setTrackDetail(trackInfo[0].track);
                  await filter().then((filterResponse) => {
                    console.log('filter', filterResponse.filters[1].values);
                    setFilters(filterResponse.filters[1].values);
                  });
                  await release(token).then((releaseresponse) => {
                    console.log('release', releaseresponse);
                    setRelease(releaseresponse.playlists.items);
                  });
                  setInterval(async () => {
                    await release(token).then((releaseresponse) => {
                      console.log('release', releaseresponse);
                      setRelease(releaseresponse.playlists.items);
                    });
                  }, 30000);
                }
              );
            })
            .catch((err) => {
              console.log(err);
            });
        });
      });
    }

    init();
  }, []);

  const genreChanged = async (e) => {
    setGenres({
      selectedGenre: e,
      listOfGenresFromAPI: genres.listOfGenresFromAPI,
    });

    await playlists(genres.selectedGenre, token)
      .then(async (playlistResponse) => {
        setPlaylist({
          selectedPlaylist: playlist.selectedPlaylist,
          listOfPlaylistFromAPI: playlistResponse.playlists.items,
        });
        await track(playlistResponse.playlists.items[0].id, token).then(
          (response) => {
            setTracks({
              selectedTracks: tracks.selectedPlaylist,
              listOfTracksFromAPI: response.items,
            });
            const currentTracks = [...response.items];
            const trackInfo = currentTracks.filter(
              (t) => t.id === response.items[0].id
            );
            setTrackDetail(trackInfo[0].track);
          }
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const playlistChanged = async (e) => {
    setPlaylist({
      selectedPlaylist: e,
      listOfPlaylistFromAPI: playlist.listOfPlaylistFromAPI,
    });

    await track(e, token)
      .then((response) => {
        setTracks({
          selectedTracks: tracks.selectedPlaylist,
          listOfTracksFromAPI: response.items,
        });
        const currentTracks = [...response.items];
        const trackInfo = currentTracks.filter(
          (t) => t.id === response.items[0].id
        );
        setTrackDetail(trackInfo[0].track);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const buttonClicked = (e) => {
    e.preventDefault();

    axios(
      `https://api.spotify.com/v1/playlists/${playlist.selectedPlaylist}/tracks?limit=10`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => {
        setTracks({
          selectedTracks: tracks.selectedPlaylist,
          listOfTracksFromAPI: response.data.items,
        });
        const currentTracks = [...tracks.listOfTracksFromAPI];
        const trackInfo = currentTracks.filter(
          (t) => t.track.id === response.data.items[0].id
        );
        setTrackDetail(trackInfo[0].track);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const listboxClicked = (e) => {
    const currentTracks = [...tracks.listOfTracksFromAPI];
    const trackInfo = currentTracks.filter((t) => t.track.id === e);
    setTrackDetail(trackInfo[0].track);
  };

  return (
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <>
        <GlobalStyles />
        <div className="container">
          {/* <button onClick={themeToggler}>Switch Theme</button> */}
          <div style={{ flexDirection: 'column' }}>
            <Switch
              title="Dark Mode"
              checked={theme === 'dark'}
              onChange={themeToggler}
              name="checkedA"
              inputProps={{ 'aria-label': 'secondary checkbox' }}
              color="primary"
            />
            <label htmlFor="">DARK MODE</label>
          </div>

          <form onSubmit={buttonClicked}>
            <div className="container">
              <div className="row">
                <div className="col-sm-6">
                  <div className="col-sm-13 form-group row px-0">
                    <label className="form-label col-sm-4">Country</label>
                    {filters && (
                      <select
                        className="form-control form-control-sm col-sm-12"
                        value="en_AU"
                        labelId="label"
                        id="select">
                        {filters.map((item) => (
                          <option value={item.value}>{item.name}</option>
                        ))}
                      </select>
                    )}
                  </div>
                  {genres && (
                    <Dropdown
                      selected={genres.selectedGenre}
                      label="Genre"
                      data={genres.listOfGenresFromAPI}
                      changed={(e) => {
                        genreChanged(e);
                      }}
                    />
                  )}
                  {playlist && (
                    <Dropdown
                      label="Playlist"
                      data={playlist.listOfPlaylistFromAPI}
                      changed={(e) => {
                        playlistChanged(e);
                      }}
                    />
                  )}
                </div>
                <div className="offset-md-1 col-sm-4">
                  {releases && <Slider data={releases} />}
                </div>
              </div>

              {/* <div className="col-sm-6 row form-group px-0">
            <button className="btn btn-success col-sm-12" type="submit">
              Search
            </button>
          </div> */}
              <div className="row" style={{ marginTop: 22 }}>
                <Listbox
                  items={tracks.listOfTracksFromAPI}
                  clicked={listboxClicked}
                />
                {trackDetail && <Detail {...trackDetail} />}
              </div>
            </div>
          </form>
        </div>
      </>
    </ThemeProvider>
  );
}

export default App;
