const express = require('express');
const userController = require('../controller/user.controller');
const { validateTokenAdm } = require('../middlewares/validateUser');

const router = express.Router();

router.get('/', validateTokenAdm, userController.getAll);
router.post('/create', validateTokenAdm, userController.admCreateUser);
router.delete('/delete/:id', validateTokenAdm, userController.deleteUser);

module.exports = router;