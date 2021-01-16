import axios from 'axios';

const release = async (token, cod2) => {
  const { data } = await axios.get(
    `https://api.spotify.com/v1/browse/featured-playlists?country=${cod2}&timestamp=2021-01-01T06:44:32&offset=0&limit=15`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return data;
};

export { release };
