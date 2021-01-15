import axios from 'axios';

const track = async (track, token) => {
  const { data } = await axios.get(
    `https://api.spotify.com/v1/playlists/${track}/tracks?limit=10`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return data;
};

export { track };
