import axios from 'axios';

const playlists = async (id, token) => {
  const { data } = await axios.get(
    `https://api.spotify.com/v1/browse/categories/${id}/playlists?limit=20`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return data;
};

export { playlists };
