const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');


router.get('/login', authController.getLogin);


router.post('/login',
body('username').notEmpty().withMessage('Ingrese usuario'),
body('password').notEmpty().withMessage('Ingrese contraseña'),
authController.postLogin
);


router.get('/logout', authController.logout);


module.exports = router;