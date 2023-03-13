import React from 'react';
import axios from 'axios';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import renderWithRouter from './helpers/renderWithRouter';
import jwtToken from './mocks/JWT';
import allProductsMock from './mocks/allProductsMock';
import sellerMock from './mocks/mockSeller';
// import mockSale from './mocks/mockSale';

jest.mock('axios');

const SUCESS_STATUS = 200;
const CUSTOMER_EMAIL = 'zebirita@email.com';
const CUSTOMER_PASSWORD = '$#zebirita#$';
const PATH_CUSTOMER_PRODUCTS = '/customer/products';
const PATH_CHECKOUT = '/customer/checkout';
const PATH_ORDER = '/customer/orders/';
const PRODUCT_TESTID_BUTTON_ADD = 'customer_products__button-card-add-item-';
// const PRODUCT_TESTID_BUTTON_RM = 'customer_products__button-card-rm-item-';

const STREET = 'Rua da Trybe';
const HOUSE_NUMBER = 12;
const BUTTON_CHECKOUT = 'customer_products__button-cart';
const ADDRESS_NUMBER_ID = 'customer_checkout__input-address-number';
const ADDRESS_ID = 'customer_checkout__input-address';
const SELLER_ID = 'customer_checkout__select-seller';
const TOTAL_PRICE_ID = 'customer_checkout__element-order-total-price';
const SELLER_NAME = /Fulana Pereira/i;

describe('Test the checkout page', () => {
  let history;
  beforeEach(async () => {
    history = renderWithRouter(<App />).history;
    axios.post.mockResolvedValueOnce({
      status: SUCESS_STATUS,
      data: {
        token: jwtToken,
      },
    });
    const email = screen.getByLabelText(/login/i);
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

  describe('The details and address form', () => {
    it('should exists with all elements', async () => {
      // daqui
      const buttonAddItems = screen
        .getByTestId(`${PRODUCT_TESTID_BUTTON_ADD}${allProductsMock[0].id}`);
      userEvent.dblClick(buttonAddItems);

      const buttonCheckout = screen
        .getByTestId(BUTTON_CHECKOUT);
      userEvent.click(buttonCheckout);
      jest.clearAllMocks();
      axios.get.mockResolvedValueOnce({
        status: SUCESS_STATUS,
        data: sellerMock,
      });
      await waitFor(() => {
        const { location: { pathname } } = history;
        expect(pathname).toBe(PATH_CHECKOUT);
      });
      // até aqui
      const seller = screen.getByTestId(SELLER_ID);
      const address = screen.getByTestId(ADDRESS_ID);
      const number = screen.getByTestId(ADDRESS_NUMBER_ID);
      const finishOrder = screen.getByRole('button', { name: /finalizar/i });

      expect(seller).toBeInTheDocument();
      expect(address).toBeInTheDocument();
      expect(number).toBeInTheDocument();
      expect(finishOrder).toBeInTheDocument();
    });
  });
  // TEST LINHA 33  NÃO COBRE
  describe('33', () => {
    it('33', async () => {
      await waitFor(() => {
        const { location: { pathname } } = history;
        expect(pathname).toBe(PATH_CUSTOMER_PRODUCTS);
      });
      axios.get.mockResolvedValueOnce({
        status: SUCESS_STATUS,
        data: sellerMock,
      });
      await waitFor(() => {
        history = renderWithRouter(<App />, { route: PATH_CHECKOUT }).history;
      });
      const subTotal = screen
        .getByTestId(TOTAL_PRICE_ID);
      expect(subTotal.textContent).toBe('0,00');
    });
  });

  // // Linha 61
  describe('The conclusion of a sale', () => {
    it('should create a sale and redirect to "/customer/orders/1"', async () => {
      // daqui
      const buttonAddItems = screen
        .getByTestId(`${PRODUCT_TESTID_BUTTON_ADD}${allProductsMock[0].id}`);
      userEvent.dblClick(buttonAddItems);

      const buttonCheckout = screen
        .getByTestId(BUTTON_CHECKOUT);
      userEvent.click(buttonCheckout);
      jest.clearAllMocks();
      axios.get.mockResolvedValueOnce({
        status: SUCESS_STATUS,
        data: sellerMock,
      });
      await waitFor(() => {
        const { location: { pathname } } = history;
        expect(pathname).toBe(PATH_CHECKOUT);
      });
      // até aqui
      const address = screen.getByTestId(ADDRESS_ID);
      const number = screen.getByTestId(ADDRESS_NUMBER_ID);
      const finishOrder = screen.getByRole('button', { name: /finalizar/i });
      userEvent.type(address, STREET);
      userEvent.type(number, HOUSE_NUMBER);
      axios.post.mockResolvedValueOnce({
        status: 201,
        data: { insertedId: 1 },
      });
      userEvent.click(finishOrder);
      jest.clearAllMocks();
      await waitFor(() => {
        const { location: { pathname } } = history;
        expect(pathname).toBe(`${PATH_ORDER}${1}`);
      });
    });
  });

  // TESTE LINHA 109 NÃO COBRE E NÃO PASSA
  describe('test the seller select', () => {
    it('if the handleChange from seller works', async () => {
      // daqui
      const buttonAddItems = screen
        .getByTestId(`${PRODUCT_TESTID_BUTTON_ADD}${allProductsMock[0].id}`);
      userEvent.dblClick(buttonAddItems);

      const buttonCheckout = screen
        .getByTestId(BUTTON_CHECKOUT);
      userEvent.click(buttonCheckout);
      jest.clearAllMocks();
      axios.get.mockResolvedValueOnce({
        status: SUCESS_STATUS,
        data: sellerMock,
      });
      await waitFor(() => {
        const { location: { pathname } } = history;
        expect(pathname).toBe(PATH_CHECKOUT);
      });
      // até aqui

      const sellerSelect = screen.getByTestId(SELLER_ID);
      const sellerOption = screen.getByRole('option', SELLER_NAME);
      userEvent.selectOptions(sellerSelect, sellerOption);
      expect(sellerSelect).toHaveTextContent('');
    });
  });
  // LINHA 129 PASSANDO E TESTANDO A LINHA CERTA
  describe('test the address input', () => {
    it('if the handleChange from address works', async () => {
      // daqui

      const buttonAddItems = screen
        .getByTestId(`${PRODUCT_TESTID_BUTTON_ADD}${allProductsMock[0].id}`);
      userEvent.dblClick(buttonAddItems);

      const buttonCheckout = screen
        .getByTestId(BUTTON_CHECKOUT);
      userEvent.click(buttonCheckout);
      jest.clearAllMocks();
      axios.get.mockResolvedValueOnce({
        status: SUCESS_STATUS,
        data: sellerMock,
      });
      await waitFor(() => {
        const { location: { pathname } } = history;
        expect(pathname).toBe(PATH_CHECKOUT);
      });
      // até aqui
      const addressInput = screen.getByTestId(ADDRESS_ID);
      // act(() => { // o warning pede pra usar isso porém se usar quebra o teste abaixo
      userEvent.type(addressInput, STREET);
      await waitFor(() => expect(addressInput).toHaveValue(STREET));
      // });
    });
  });
  // TESTE LINHA 139 PASSANDO E TESTANDO A LINHA CORRETA
  describe('test the address input number', () => {
    it('if the handleChange from address number works', async () => {
      // daqui

      const buttonAddItems = screen
        .getByTestId(`${PRODUCT_TESTID_BUTTON_ADD}${allProductsMock[0].id}`);
      userEvent.dblClick(buttonAddItems);

      const buttonCheckout = screen
        .getByTestId(BUTTON_CHECKOUT);
      userEvent.click(buttonCheckout);
      jest.clearAllMocks();
      axios.get.mockResolvedValueOnce({
        status: SUCESS_STATUS,
        data: sellerMock,
      });
      await waitFor(() => {
        const { location: { pathname } } = history;
        expect(pathname).toBe(PATH_CHECKOUT);
      });
      // até aqui

      const numberInput = screen.getByTestId(ADDRESS_NUMBER_ID);
      userEvent.type(numberInput, HOUSE_NUMBER.toString());
      await waitFor(() => expect(numberInput).toHaveValue(HOUSE_NUMBER));
    });
  });
});
