import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import userEvent from '@testing-library/user-event';
import renderWithRouter from './helpers/renderWithRouter';
import SellerOrders from '../pages/SellerOrders';

jest.mock('axios');

const DATE_SALE_ID = 'seller_orders__element-order-date-1';
const DELIVERY_STATUS_ID = 'seller_orders__element-delivery-status-1';
const CARD_PRICE_ID = 'seller_orders__element-card-price-1';
const ADRESS_ID = 'seller_orders__element-card-address-1';
const PATH_SELLER_ORDERS = 'seller/orders';
const SUCESS_STATUS = 200;

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

const ARR_SALES = [SALES_MOCK_PENDING.orders];

describe('Test the Seller Orders Details', () => {
  let history;
  beforeEach(async () => {
    global.localStorage.setItem('user', ZEBIRITA_LOGIN_MOCK);
    global.localStorage.setItem('cartItems', CART_ITEMS_MOCK);
    axios.post.mockResolvedValueOnce({
      status: 201,
      data: { insertedId: 1 },
    });
    global.localStorage.removeItem('user');
    global.localStorage.setItem('user', SELLER_LOGIN_MOCK);
    axios.get.mockResolvedValueOnce({
      status: SUCESS_STATUS,
      data: ARR_SALES,
    });
    history = renderWithRouter(
      <SellerOrders />,
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
      const deliveryStatus = screen.getByTestId(DELIVERY_STATUS_ID);
      const cardPrice = screen.getByTestId(CARD_PRICE_ID);
      const adress = screen.getByTestId(ADRESS_ID);
      expect(saleDate).toBeInTheDocument();
      expect(deliveryStatus).toBeInTheDocument();
      expect(cardPrice).toBeInTheDocument();
      expect(adress).toBeInTheDocument();
    });
    it('should have a button to redirect to "/seller/oders/1"', async () => {
      const deliveryStatus = screen.getByTestId(DELIVERY_STATUS_ID);
      userEvent.click(deliveryStatus);
      const { location: { pathname } } = history;
      expect(pathname).toBe('/seller/orders/1');
    });
  });
});
