import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import renderWithRouter from './helpers/renderWithRouter';
import App from '../App';
import jwtToken from './mocks/JWT';
import allProductsMock from './mocks/allProductsMock';
import sellerMock from './mocks/mockSeller';

jest.mock('axios');

const SUCESS_STATUS = 200;
const PATH_CUSTOMER_PRODUCTS = '/customer/products';
const CUSTOMER_EMAIL = 'zebirita@email.com';
const CUSTOMER_PASSWORD = '$#zebirita#$';
const PRODUCT_TESTID_BUTTON_TOTAL = 'customer_products__checkout-bottom-value';
const PRODUCT_TESTID_BUTTON_ADD = 'customer_products__button-card-add-item-';
const PRODUCT_TESTID_BUTTON_REMOVE = 'customer_products__button-card-rm-item-';
const PRODUCT_TESTID_INPUT_QUANTITY = 'customer_products__input-card-quantity-';

describe('Test the Product', () => {
  let history;
  beforeEach(async () => {
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
    await waitFor(() => {
      const { location: { pathname } } = history;
      expect(pathname).toBe(PATH_CUSTOMER_PRODUCTS);
    });
  });
  afterEach(() => {
    jest.clearAllMocks();
    global.localStorage.clear();
  });
  describe('The Product Card', () => {
    it('should exists with all elements', async () => {
      const buttonAddItems = screen
        .getByTestId(`${PRODUCT_TESTID_BUTTON_ADD}${allProductsMock[0].id}`);
      const buttonRemoveItems = screen
        .getByTestId(`${PRODUCT_TESTID_BUTTON_REMOVE}${allProductsMock[0].id}`);
      const inputQuantity = screen
        .getByTestId(`${PRODUCT_TESTID_INPUT_QUANTITY}${allProductsMock[0].id}`);
      const buttonTotalItems = screen.getByTestId(PRODUCT_TESTID_BUTTON_TOTAL);
      expect(buttonAddItems).toBeInTheDocument();
      expect(inputQuantity).toBeInTheDocument();
      expect(buttonRemoveItems).toBeInTheDocument();
      expect(buttonTotalItems).toBeInTheDocument();
    });
  });
  it('Test the functionality of the function addItems', async () => {
    const buttonAddItems = screen
      .getByTestId(`${PRODUCT_TESTID_BUTTON_ADD}${allProductsMock[0].id}`);
    const inputQuantity = screen
      .getByTestId(`${PRODUCT_TESTID_INPUT_QUANTITY}${allProductsMock[0].id}`);
    userEvent.click(buttonAddItems);
    expect(inputQuantity.value).toBe('1');
  });
  it('Test the functionality of the function rmItem', async () => {
    const buttonAddItems = screen
      .getByTestId(`${PRODUCT_TESTID_BUTTON_ADD}${allProductsMock[0].id}`);
    userEvent.dblClick(buttonAddItems);
    const buttonRmItems = screen
      .getByTestId(`${PRODUCT_TESTID_BUTTON_REMOVE}${allProductsMock[0].id}`);
    const inputQuantity = screen
      .getByTestId(`${PRODUCT_TESTID_INPUT_QUANTITY}${allProductsMock[0].id}`);
    userEvent.click(buttonRmItems);
    expect(inputQuantity.value).toBe('1');
  });
  it('Should have input set as 0 if the number in the input is negative', async () => {
    const buttonAddItems = screen
      .getByTestId(`${PRODUCT_TESTID_BUTTON_ADD}${allProductsMock[0].id}`);
    userEvent.click(buttonAddItems);
    const buttonRmItems = screen
      .getByTestId(`${PRODUCT_TESTID_BUTTON_REMOVE}${allProductsMock[0].id}`);
    const inputQuantity = screen
      .getByTestId(`${PRODUCT_TESTID_INPUT_QUANTITY}${allProductsMock[0].id}`);
    userEvent.dblClick(buttonRmItems);
    expect(inputQuantity.value).toBe('0');
  });
  it('Test the functionality of the function addManualy', async () => {
    const inputQuantity = screen
      .getByTestId(`${PRODUCT_TESTID_INPUT_QUANTITY}${allProductsMock[0].id}`);
    userEvent.clear(inputQuantity);
    userEvent.type(inputQuantity, '2');
    expect(inputQuantity.value).toBe('2');
  });
  it('Test if it is possible to type 0 in inputQuantity', async () => {
    const inputQuantity = screen
      .getByTestId(`${PRODUCT_TESTID_INPUT_QUANTITY}${allProductsMock[0].id}`);
    userEvent.clear(inputQuantity);
    userEvent.type(inputQuantity, '0');
    expect(inputQuantity.value).toBe('0');
  });
  it('Test if the checkout button redirects to "/customer/checkout"', async () => {
    const inputQuantity = screen
      .getByTestId(`${PRODUCT_TESTID_INPUT_QUANTITY}${allProductsMock[0].id}`);
    userEvent.clear(inputQuantity);
    userEvent.type(inputQuantity, '2');
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
  });
});
