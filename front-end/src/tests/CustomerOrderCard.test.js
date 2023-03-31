import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import renderWithRouter from './helpers/renderWithRouter';
import App from '../App';
import jwtToken from './mocks/JWT';
// import allProductsMock from './mocks/allProductsMock';
// import sellerMock from './mocks/mockSeller';

jest.mock('axios');

const PATH_CUSTOMER_PRODUCTS = '/customer/products';
// const PATH_CUSTOMER_ORDERS = '/customer/orders';

describe('Test the CustomerOrderCard component', () => {
  let history;
  beforeEach(() => {
    history = renderWithRouter(<App />).history;
    axios.post.mockResolvedValueOnce({
      status: SUCESS_STATUS,
      data: {
        token: jwtToken,
      },
    });
    const email = screen.getByRole('textbox', { name: /login/i });
    const password = screen.getByLabelText(/senha/i);
    const login = screen.getByRole('button', { name: /login/i });
    userEvent.type(email, CUSTOMER_EMAIL);
    userEvent.type(password, CUSTOMER_PASSWORD);
    userEvent.click(login);
    jest.clearAllMocks();
    axios.get.mockResolvedValueOnce({
      status: SUCESS_STATUS,
      data: allProductsMock,
    });
  });
  afterEach(() => {
    jest.clearAllMocks();
    global.localStorage.clear();
  });

  it('should exists with all elements', async () => {
    await waitFor(() => {
      const { location: { pathname } } = history;
      expect(pathname).toBe(PATH_CUSTOMER_PRODUCTS);
    });
    const buttonAddItems = screen
      .getByTestId(`${PRODUCT_TESTID_BUTTON_ADD}${allProductsMock[0].id}`);
    userEvent.dblClick(buttonAddItems);

    const buttonCheckout = screen
      .getByTestId('customer_products__button-cart');
    userEvent.click(buttonCheckout);
    jest.clearAllMocks();
    axios.get.mockResolvedValueOnce({
      status: SUCESS_STATUS,
      data: sellerMock,
    });
    await waitFor(() => {
      const { location: { pathname } } = history;
      expect(pathname).toBe('/customer/checkout');
    });
    const itemNumber = screen
      .getByTestId('customer_checkout__element-order-table-item-number-0');
    const itemName = screen
      .getByTestId('customer_checkout__element-order-table-name-0');
    const itemQuantity = screen
      .getByTestId('customer_checkout__element-order-table-quantity-0');
    const itemPrice = screen
      .getByTestId('customer_checkout__element-order-table-unit-price-0');
    const itemSubtotal = screen
      .getByTestId('customer_checkout__element-order-table-sub-total-0');
    const buttomRemove = screen
      .getByTestId('customer_checkout__element-order-table-remove-0');
    expect(itemNumber).toBeInTheDocument();
    expect(itemName).toBeInTheDocument();
    expect(itemQuantity).toBeInTheDocument();
    expect(itemPrice).toBeInTheDocument();
    expect(itemSubtotal).toBeInTheDocument();
    expect(buttomRemove).toBeInTheDocument();
  });
});
