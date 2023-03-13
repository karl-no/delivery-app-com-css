const express = require('express');

const router = express.Router();
const loginRouter = require('./login.router');
const registerRouter = require('./register.route');
const userRouter = require('./user.route');
const salesRouter = require('./sales.route');
const productsRouter = require('./products.route');
const sellerRouter = require('./sellers.route');
const ordersRouter = require('./orders.route');
const admRouter = require('./adm.router');

router.use('/login', loginRouter);
router.use('/register', registerRouter);
router.use('/user', userRouter);
router.use('/sales', salesRouter);
router.use('/products', productsRouter);
router.use('/seller', sellerRouter);
router.use('/orders', ordersRouter);
router.use('/admin', admRouter);

module.exports = router;
