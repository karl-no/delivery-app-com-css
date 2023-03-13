import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import Header from '../components/Header';
import { products } from '../api/products';
import Context from '../context/Context';
import ProductCard from '../components/ProductCard';

export default function Products() {
  const history = useHistory();
  const { totalCart } = useContext(Context);
  const [isDisabled, setIsDisabled] = useState(true);
  const [productsData, setProduct] = useState([]);

  const setStateProduct = async () => {
    const dataProducts = await products();
    console.log(dataProducts, 'RESULT PRODUCTS!');
    return setProduct(dataProducts);
  };

  const totalButtonHandler = () => {
    if (totalCart > 0) setIsDisabled(false);
    if (totalCart === 0) setIsDisabled(true);
  };

  useEffect(() => {
    setStateProduct();
  }, []);

  useEffect(() => {
    totalButtonHandler();
  });

  return (
    <section>
      <Header />
      <div className="p-8 flex flex-wrap justify-center m-auto gap-10 lg:pl-12 lg:pr-12">
        {productsData.length && productsData.map((product, i) => (
          <ProductCard key={ `${product.id}-${i}` } product={ { ...product } } />
        ))}
      </div>
      <button
        type="button"
        name="totalButton"
        className="fixed bottom-4 right-6 p-2 pl-4 pr-4 bg-primary text-white
          text-xl font-semibold rounded-lg"
        data-testid="customer_products__button-cart"
        disabled={ isDisabled }
        onClick={ () => history.push('/customer/checkout') }
      >
        Ver Carrinho: R$
        {' '}
        <span data-testid="customer_products__checkout-bottom-value">
          {totalCart.toFixed(2).replace('.', ',')}
        </span>
      </button>
    </section>
  );
}
