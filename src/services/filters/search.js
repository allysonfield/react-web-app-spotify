import axios from 'axios';

const search = async (key, limit, token) => {
  try {
    const { data } = await axios.get(
      `https://api.spotify.com/v1/search?query=${key}&offset=0&limit=${limit}&type=playlist`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    throw error;
  }
};

export { search };
