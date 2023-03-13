import axios from 'axios';

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
    return error;
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
    console.log(error, 'Erro LOGIN');
    return error;
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

export const getAll = async (token) => {
  try {
    const response = await axios.get(
      'http://localhost:3001/admin/',
      {
        headers: {
          'content-type': CONTEXT_TYPE,
          authorization: token,
        },
      },
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const admRegisterNewUser = async (token, user) => {
  try {
    const response = await axios.post(
      'http://localhost:3001/admin/create',
      {
        ...user,
      },
      {
        headers: {
          'content-type': CONTEXT_TYPE,
          authorization: token,
        },
      },
    );
    return response.status;
  } catch (error) {
    return error;
  }
};

export const deletedUser = async (id, token) => {
  try {
    const response = await axios.delete(
      `http://localhost:3001/admin/delete/${id}`,
      {
        headers: {
          'content-type': CONTEXT_TYPE,
          authorization: token,
        },
      },
    );
    return response;
  } catch (error) {
    return error;
  }
};
