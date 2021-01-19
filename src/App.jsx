import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ThemeProvider } from 'styled-components';
import { Switch } from '@material-ui/core';
import InfiniteScroll from 'react-infinite-scroll-component';
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
import { search } from './services/filters/search';
import mock from './JSON/mock.json';
import useShare from './Utils/useShare';
import Console from './Utils/console';

let limit = 10;
let interval = null;
function App() {
  new useShare({ cod1: 'pt_BR', cod2: 'BR' });
  const [token, setToken] = useState();
  const [country, setCountry] = useState({
    selectedCountry: 'Brasil',
    mock: [],
  });
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
  const [list, setList] = useState({ selectedList: '', listOfPlFromAPI: [] });
  const [trackDetail, setTrackDetail] = useState(null);
  const [releases, setRelease] = useState(null);
  const [key, setKey] = useState(null);

  const [theme, setTheme] = useState('dark');

  const themeToggler = () => {
    theme === 'light' ? setTheme('dark') : setTheme('light');
  };
  useEffect(() => {
    async function init() {
      await access().then(async (token) => {
        Console(token);
        setToken(token);
        localStorage.setItem('tk@spotify', token);

        await genre(token, useShare.state.cod1).then(async (genreResponse) => {
          Console('categoriass', genreResponse);
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
                  Console('trackResponse', trackResponse);
                  setTracks({
                    selectedTracks: tracks.selectedPlaylist,
                    listOfTracksFromAPI: trackResponse.items,
                  });
                  const currentTracks = [...trackResponse.items];
                  const trackInfo = currentTracks.filter(
                    (t) => t.id === trackResponse.items[0].id
                  );
                  setTrackDetail(trackInfo[0].track);

                  Console('filter', mock);
                  setFilters(mock);

                  await release(token, useShare.state.cod2).then(
                    (releaseresponse) => {
                      // Console('release', releaseresponse);
                      setRelease(releaseresponse.playlists.items);
                    }
                  );
                  interval = setInterval(async () => {
                    await release(token, useShare.state.cod2).then(
                      (releaseresponse) => {
                        // Console('release', releaseresponse);
                        setRelease(releaseresponse.playlists.items);
                      }
                    );
                  }, 30000);
                }
              );
            })
            .catch((err) => {
              Console(err);
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
        Console(err);
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
        Console(err);
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
        Console(err);
      });
  };

  const listboxClicked = (e) => {
    const currentTracks = [...tracks.listOfTracksFromAPI];
    const trackInfo = currentTracks.filter((t) => t.track.id === e);
    setTrackDetail(trackInfo[0].track);
  };

  const fetchData = async () => {
    limit += 10;
    await search(key, limit, token)
      .then(async (searchResponse) => {
        if (searchResponse.playlists.items.length > 0) {
          setList({
            ...list,
            listOfPlFromAPI: searchResponse.playlists.items,
          });
        }
      })
      .catch(() => {
        limit = 10;
      });
  };

  const changeSearch = async (e) => {
    setKey(e);
    Console('search', e);
    await search(e, limit, token)
      .then(async (searchResponse) => {
        if (searchResponse.playlists.items.length > 0) {
          setList({
            selectedList: list.selectedList,
            listOfPlFromAPI: searchResponse.playlists.items,
          });
        } else {
          setList({
            selectedList: '',
            listOfPlFromAPI: [],
          });
        }
      })
      .catch(() => {
        setList({
          selectedList: '',
          listOfPlFromAPI: [],
        });
      });
  };

  const selectTo = async (e) => {
    setPlaylist({
      selectedPlaylist: e,
      listOfPlaylistFromAPI: list.listOfPlFromAPI,
    });
    await track(e, token).then((response) => {
      setTracks({
        selectedTracks: tracks.selectedPlaylist,
        listOfTracksFromAPI: response.items,
      });
      const currentTracks = [...response.items];
      const trackInfo = currentTracks.filter(
        (t) => t.id === response.items[0].id
      );
      setTrackDetail(trackInfo[0].track);
      setList({ selectedList: '', listOfPlFromAPI: [] });
    });
  };

  const changedLocale = async (e) => {
    Console('e', e);
    setCountry({
      selectedCountry: filters[e].country,
      mock: filters[e],
    });

    await genre(token, filters[e].value).then(async (genreResponse) => {
      Console('categorias', genreResponse);
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

              await release(token, filters[e].code).then((releaseresponse) => {
                Console('release', releaseresponse);
                setRelease(releaseresponse.playlists.items);
              });
              clearInterval(interval);
              setInterval(async () => {
                await release(token, filters[e].code).then(
                  (releaseresponse) => {
                    Console('release', releaseresponse);
                    setRelease(releaseresponse.playlists.items);
                  }
                );
              }, 30000);
            }
          );
        })
        .catch((err) => {
          Console(err);
        });
    });
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
            <div className="col-sm-13 form-group row px-0 ">
              <label className="form-label col-sm-4">Search</label>

              <input
                className="form-control form-control-sm col-sm-12"
                placeholder="Goosebumps - Remix..."
                value={key}
                onChange={(e) => changeSearch(e.target.value)}
                labelId="label"
                id="select"
                onFocus={(e) => changeSearch(e.target.value)}
              />
              {list.listOfPlFromAPI.length > 0 && (
                <div
                  style={{
                    position: 'absolute',
                    marginTop: '73px',
                    zIndex: 10,
                  }}
                  className="col-sm-10 list-group px-0 ">
                  <InfiniteScroll
                    dataLength={list.listOfPlFromAPI.length} // This is important field to render the next data
                    next={fetchData}
                    hasMore
                    loader={<h4>Loading...</h4>}
                    endMessage={
                      <p style={{ textAlign: 'center' }}>
                        <b>Yay! You have seen it all</b>
                      </p>
                    }
                    // below props only if you need pull down functionality
                    // refreshFunction={this.refresh}
                  >
                    {list.listOfPlFromAPI.map((item) => (
                      <button
                        className="list-group-item list-group-item-action list-group-item-light"
                        type="button"
                        onClick={() => selectTo(item.id)}
                        id={item.id}>
                        {item.name}
                      </button>
                    ))}
                  </InfiniteScroll>
                </div>
              )}
            </div>
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
                        value={country.selectedCountry}
                        labelId="label"
                        onChange={(e) => changedLocale(e.target.value)}
                        id="select">
                        {filters.map((item, i) => (
                          <option value={i}>{item.country}</option>
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
