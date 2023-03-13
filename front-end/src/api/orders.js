import axios from 'axios';

export const CONTEXT_TYPE = 'application/json';
export const NOT_FOUND = 404;

export const getSallesBySeller = async (token) => {
  try {
    const data = await axios.get(
      'http://localhost:3001/orders/seller',
      {
        headers: {
          'content-type': CONTEXT_TYPE,
          authorization: token,
        },
      },
    );
    return data;
  } catch (error) {
    return error;
  }
};

export const getOrderById = async (token, id) => {
  try {
    const data = await axios.get(
      `http://localhost:3001/orders/seller/sales/${id}`,
      {
        headers: {
          'content-type': CONTEXT_TYPE,
          authorization: token,
        },
      },
    );
    return Object.values(data.data);
  } catch (error) {
    return error;
  }
};

export const updateStatus = async (token, id, status) => {
  try {
    const response = await axios.put(
      `http://localhost:3001/orders/status/${id}`,
      {
        status,
      },
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

export const getCustomerOrders = async (user, token) => {
  try {
    const response = await axios.get(
      `http://localhost:3001/orders?user=${user}`,
      {},
      {
        headers: {
          'content-type': CONTEXT_TYPE,
          authorization: token,
        },
      },
    );
    return response.data;
  } catch (error) {
    switch (error.response.status) {
    case NOT_FOUND:
      return 'Orders Not Found';
    default:
      return 'internal server error';
    }
  }
};

export const getCustomerOrderById = async (token, id) => {
  try {
    const data = await axios
      .get(
        `http://localhost:3001/orders/${id}`,
        {},
        {
          headers: {
            'content-type': CONTEXT_TYPE,
            authorization: token,
          },
        },
      );
    return data.data;
  } catch (error) {
    return error;
  }
};
