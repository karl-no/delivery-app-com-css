import axios from 'axios';

export const BAD_REQUEST = 400;

export const createSale = async (payload, jwt) => {
  try {
    const data = await axios
      .post(
        'http://localhost:3001/sales/create',
        {
          ...payload,
        },
        {
          headers: {
            'content-type': 'application/json',
            authorization: jwt,
          },
        },
      );
    return data;
  } catch (error) {
    switch (error.response.status) {
    case BAD_REQUEST:
      return 'Some fields are invalid';
    default:
      return 'internal server error';
    }
  }
};
