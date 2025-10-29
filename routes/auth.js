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

module.exports = router;
