import axios from 'axios';

const genre = async (token) => {
  const { data } = await axios.get(
    'https://api.spotify.com/v1/browse/categories?locale=pt_BR',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return data;
};

export { genre };
