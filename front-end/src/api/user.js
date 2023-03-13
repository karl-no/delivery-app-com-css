import axios from 'axios';

const BAD_REQUEST = 400;
const USER_ALREADY_REGISTERED = 409;
const CONTEXT_TYPE = 'application/json';

export const registerNewUser = async (user) => {
  try {
    const data = await axios
      .post(
        'http://localhost:3001/register',
        {
          ...user,
        },
        {
          headers: {
            'content-type': CONTEXT_TYPE,
          },
        },
      );
    return data.status;
  } catch (error) {
    switch (error.response.status) {
    case BAD_REQUEST:
      return 'Some fields are invalid';
    case USER_ALREADY_REGISTERED:
      return 'User already registered';
    default:
      return 'internal server error';
    }
  }
};

export const login = async (user) => {
  try {
    const data = await axios
      .post(
        'http://localhost:3001/login',
        {
          ...user,
        },
        {
          headers: {
            'content-type': CONTEXT_TYPE,
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

export const getSellers = async () => {
  try {
    const data = await axios.get(
      'http://localhost:3001/seller',
      {
        headers: {
          'content-type': CONTEXT_TYPE,
        },
      },
    );
    return data;
  } catch (error) {
    return error;
  }
};

export const getUserById = async (id) => {
  try {
    const data = await axios.get(
      `http://localhost:3001/user/${id}`,
      {
        headers: {
          'content-type': CONTEXT_TYPE,
        },
      },
    );
    return data.data;
  } catch (error) {
    return error;
  }
};
