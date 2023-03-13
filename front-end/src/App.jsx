import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import Provider from './context/Provider';
import Checkout from './pages/Checkout';
import SellerOrders from './pages/SellerOrders';
import CustomerOrders from './pages/CustomerOrders';
import CustomerOrderDetails from './pages/CustomerOrderDetails';
import SellerOrdersDetails from './pages/SellerOrdersDetails';
import AdmManagement from './pages/AdmManagement';
import './App.css';

function App() {
  return (
    <div className="App">
      <Provider>
        <Switch>
          <Route exact path="/register" component={ Register } />
          <Route exact path="/login" component={ Login } />
          <Route exact path="/customer/checkout" component={ Checkout } />
          <Route exact path="/customer/products" component={ Products } />
          <Route exact path="/customer/checkout" component={ Checkout } />
          <Route exact path="/seller/orders" component={ SellerOrders } />
          <Route exact path="/customer/orders" component={ CustomerOrders } />
          <Route exact path="/admin/manage" component={ AdmManagement } />
          <Route exact path="/customer/orders/:id" component={ CustomerOrderDetails } />
          <Route exact path="/seller/orders/:id" component={ SellerOrdersDetails } />
          <Route exact path="/" render={ () => <Redirect to="/login" /> } />
        </Switch>
      </Provider>
    </div>
  );
}

export default App;
