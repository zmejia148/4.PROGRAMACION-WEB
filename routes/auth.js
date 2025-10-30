const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
console.log('authController importado:', authController);

// Login
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

// Registro
router.get('/register', authController.getRegister);
router.post('/register', authController.postRegister);

// Logout
router.get('/logout', authController.logout);

// Ruta protegida del home
router.get('/layouts', authController.mostrarHome);

// Ruta protegida del Form productos
router.get('/products', authController.mostrarProduct);

module.exports = router;
