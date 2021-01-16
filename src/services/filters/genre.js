import axios from 'axios';

const genre = async (token, cod1) => {
  const { data } = await axios.get(
    `https://api.spotify.com/v1/browse/categories?locale=${cod1}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return data;
};

export { genre };
