import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Header from '../components/Header';
import TableBody from '../components/TableBody';
import Context from '../context/Context';
import { getSellers } from '../api/user';
import { createSale } from '../api/sales';

export default function Checkout() {
  const history = useHistory();
  const {
    cartItems,
    setCartItems,
    lsUserData,
  } = useContext(Context);

  const [sellers, setSellers] = useState([]);
  const [sellerDefault, setSellerDefault] = useState();

  const [customerAddress, setCustomerAddress] = useState({
    seller: '',
    address: '',
    addressNumber: '',
  });

  const items = Object.values(cartItems);

  const getTotal = () => {
    const total = items.reduce((acc, curr) => acc + Number(curr.subTotal), 0);
    return total.toFixed(2).replace('.', ',');
  };

  const removeItem = (id) => {
    const newCartItems = { ...cartItems };
    delete newCartItems[id];
    setCartItems(newCartItems);
  };

  const handleChange = ({ target: { name, value } }) => {
    setCustomerAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const concludeSale = async () => {
    const sale = {
      userEmail: lsUserData.email,
      sellerName: sellerDefault,
      totalPrice: Number(getTotal().replace(',', '.')),
      deliveryAddress: customerAddress.address,
      deliveryNumber: customerAddress.addressNumber,
      productsId: Object.values(cartItems).map((item) => item.id),
      quantity: Object.values(cartItems).map((item) => item.quantity),
    };

    const result = await createSale(sale, lsUserData.token);
    history.push(`/customer/orders/${result.data.insertedId}`);
    localStorage.removeItem('cartItems');
  };

  useEffect(() => {
    const getInitialSellers = async () => {
      const sellersFromApi = await getSellers();
      setSellers(sellersFromApi.data);

      setSellerDefault(...Object.values(sellersFromApi.data[0]));
    };
    getInitialSellers();
  }, []);
  return (
    <div className="checkout-main-container">
      <Header />
      <table>
        <h1>Finalizar Pedido</h1>
        <thead>
          <tr>
            <th>Item</th>
            <th>Descrição</th>
            <th>Quantidade</th>
            <th>Valor Unitário</th>
            <th>Sub-total</th>
            <th>Remover Item</th>
          </tr>
        </thead>
        <tbody>
          { items && items.map((data, i) => (
            <TableBody
              data={ data }
              index={ i }
              key={ `${data.description}-${i}` }
              removeItem={ removeItem }
            />
          ))}
        </tbody>
        <span data-testid="customer_checkout__element-order-total-price">
          { getTotal() ? getTotal() : 0.00 }
        </span>
      </table>
      <fieldset>
        <h2>Detalhes e Endereço para Entrega</h2>
        <label htmlFor="seller-input">
          P. Vendedora Responsável
          <select
            name="seller"
            value={ customerAddress.seller }
            onChange={ (e) => handleChange(e) }
            id="seller-input"
            data-testid="customer_checkout__select-seller"
          >
            { sellers?.map((seller, i) => (
              <option
                value={ seller.name }
                key={ `${seller}-${i}` }
              >
                { seller.name }
              </option>
            ))}
          </select>
        </label>
        <label htmlFor="address-input">
          Endereço:
          <input
            type="text"
            name="address"
            value={ customerAddress.address }
            onChange={ (e) => handleChange(e) }
            id="address-input"
            data-testid="customer_checkout__input-address"
          />
        </label>
        <label htmlFor="house-number">
          <input
            type="number"
            name="addressNumber"
            value={ customerAddress.addressNumber }
            onChange={ (e) => handleChange(e) }
            id="house-number"
            data-testid="customer_checkout__input-address-number"
          />
        </label>
        <button
          type="button"
          data-testid="customer_checkout__button-submit-order"
          onClick={ concludeSale }
        >
          FINALIZAR PEDIDO
        </button>
      </fieldset>
    </div>
  );
}
