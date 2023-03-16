import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import renderWithRouter from './helpers/renderWithRouter';
import SellerOrdersDetails from '../pages/SellerOrdersDetails';

jest.mock('axios');

const BUTTON_PREPARING_ID = 'seller_order_details__button-preparing-check';
const DATE_SALE_ID = 'seller_order_details__element-order-details-label-order-date';
const BUTTON_DISPATCH_ID = 'seller_order_details__button-dispatch-check';
const PATH_SELLER_ORDERS = 'seller/orders';
const SUCESS_STATUS = 200;
const UPDATED = 204;

const SELLER_LOGIN_MOCK = {
  name: 'Fulana Pereira',
  email: 'fulana@deliveryapp.com',
  role: 'seller',
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.'
   + 'eyJkYXRhIjp7ImVtYWlsIjoiZnVsYW5hQGRlbGl2ZX'
   + 'J5YXBwLmNvbSIsIm5hbWUiOiJGdWxhbmEgUGVyZWlyYS'
   + 'IsInJvbGUiOiJzZWxsZXIifSwiaWF0IjoxNjc4NzQ2OD'
   + 'I2LCJleHAiOjE2Nzg4MzMyMjZ9.D9r8oPZH1FHyajIhLC'
   + 'sHLCxidBZLEKN1ZmzyafGrkPc' };

const ZEBIRITA_LOGIN_MOCK = {
  name: 'Cliente Zé Birita',
  email: 'zebirita@email.com',
  role: 'customer',
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.'
    + 'eyJkYXRhIjp7ImVtYWlsIjoiemViaXJpdGFAZW1haW'
    + 'wuY29tIiwibmFtZSI6IkNsaWVudGUgWsOpIEJpcml0Y'
    + 'SIsInJvbGUiOiJjdXN0b21lciJ9LCJpYXQiOjE2Nzg3ND'
    + 'g5MTEsImV4cCI6MTY3ODgzNTMxMX0.KrIJTZH_-8Dsaf9'
    + 'wvJaFvYsjqreZcoiesTtNvvo9Oew' };

const CART_ITEMS_MOCK = [
  {
    1: {
      id: 1,
      name: 'Skol Lata 250ml',
      unitPrice: 2.20,
      quantity: 2,
      urlImage: 'http://localhost:3001/images/skol_lata_350ml.jpg',
      subTotal: 4.40,
    },
  },
];

const SALES_MOCK_PENDING = {
  orders:
    {
      deliveryAddress: 'Rua da Trybe',
      deliveryNumber: '12',
      id: 1,
      products: [
        {
          SalesProducts: { quantity: 2 },
          id: 1,
          name: 'Skol Lata 250ml',
          price: '2.20',
        },
        {
          SalesProducts: { quantity: 2 },
          id: 2,
          name: 'Heineken 600ml',
          price: '7.50',
        },
      ],
      saleDate: '2023-03-13T22:57:51.000Z',
      sellerId: 2,
      status: 'Pendente',
      totalPrice: '19.40',
      userId: 3,
    },
};

describe('Test the Seller Orders Details', () => {
  let history;
  beforeEach(async () => {
    // GERAR UMA VENDA
    // > SETAR O USER
    global.localStorage.setItem('user', ZEBIRITA_LOGIN_MOCK);
    // > SETAR A VENDA, OU SEJA ADICIONAR AS COISAS NO CARRINHO
    global.localStorage.setItem('cartItems', CART_ITEMS_MOCK);
    // > CLICAR NO BOTÃO
    axios.post.mockResolvedValueOnce({
      status: 201,
      data: { insertedId: 1 },
    });
    // LIMPA O USER
    global.localStorage.removeItem('user');
    // SETAR NO LOCAL STORAGE O USER SELLER
    global.localStorage.setItem('user', SELLER_LOGIN_MOCK);
    // FAZ UM GET DO ORDER BY ID
    axios.get.mockResolvedValueOnce({
      status: SUCESS_STATUS,
      data: SALES_MOCK_PENDING,
    });
    // RENDERIZAR A ROTA http://localhost:3000/seller/orders/1
    history = renderWithRouter(
      <SellerOrdersDetails />,
      { route: PATH_SELLER_ORDERS },
    ).history;
    await waitFor(() => {
      const { location: { pathname } } = history;
      expect(pathname).toBe(PATH_SELLER_ORDERS);
    });
  });
  afterEach(() => {
    jest.clearAllMocks();
    global.localStorage.clear();
  });
  describe('The Seller Orders Details', () => {
    it('should exists with all elements', async () => {
      const saleDate = screen.getByTestId(DATE_SALE_ID);
      const buttonStatus = screen.getByTestId(BUTTON_PREPARING_ID);
      const buttonDispatch = screen.getByTestId(BUTTON_DISPATCH_ID);
      expect(buttonDispatch).toBeInTheDocument();
      expect(saleDate).toBeInTheDocument();
      expect(buttonStatus).toBeInTheDocument();
    });
    it('Handle Status for "Saiu para Entrega"', async () => {
      const buttonStatus = screen.getByTestId(BUTTON_DISPATCH_ID);
      await waitFor(() => expect(buttonStatus).toHaveTextContent('Saiu Para Entrega'));
    });
    it('Handle Status for "Em Trânsito"', async () => {
      axios.get.mockResolvedValueOnce({
        status: SUCESS_STATUS,
        token: SELLER_LOGIN_MOCK,
      });
      axios.put.mockResolvedValueOnce({
        status: UPDATED,
        data: SELLER_LOGIN_MOCK,
      });
      const buttonPreparing = screen.getByTestId(BUTTON_PREPARING_ID);
      userEvent.click(buttonPreparing);
      // tá retornando preparando
      await waitFor(() => expect(buttonPreparing).toHaveValue('Preparando'));
      const buttonDispatch = screen.getByTestId(BUTTON_DISPATCH_ID);
      // passa a retornar o em trânsito
      axios.get.mockResolvedValueOnce({
        status: SUCESS_STATUS,
        lsUserData: SELLER_LOGIN_MOCK,
      });
      axios.put.mockResolvedValueOnce({
        status: UPDATED, // precisa ser 204
        data: SELLER_LOGIN_MOCK,
      });
      userEvent.click(buttonDispatch);
      // sempre tem que observar no buttonPreparing
      await waitFor(() => expect(buttonPreparing).toHaveValue('Em Trânsito'));
    });
  });
});
