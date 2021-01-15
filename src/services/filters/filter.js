import axios from 'axios';

const filter = async () => {
  const { data } = await axios.get(
    'http://www.mocky.io/v2/5a25fade2e0000213aa90776'
  );
  return data;
};

export { filter };
