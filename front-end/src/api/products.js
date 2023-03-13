import axios from 'axios';

export const NOT_FOUND = 404;

export const products = async () => {
  try {
    const data = await axios
      .get(
        'http://localhost:3001/products',
        {},
        {
          headers: {
            'content-type': 'application/json',
          },
        },
      );
    return data.data;
  } catch (error) {
    return error;
  }
};
