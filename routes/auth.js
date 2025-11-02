const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
console.log('authController importado:', authController);

// ============================
// 🧩 RUTAS DE AUTENTICACIÓN
// ============================

// 🔹 Mostrar formulario de login
router.get('/login', authController.getLogin);

// 🔹 Procesar login
router.post('/login', async (req, res, next) => {
    try {
        // Llama al controlador que valida usuario y contraseña
        await authController.postLogin(req, res, next);
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).send('Error al iniciar sesión');
    }
});

// 🔹 Mostrar formulario de registro
router.get('/register', authController.getRegister);

// 🔹 Procesar registro
router.post('/register', async (req, res, next) => {
    try {
        await authController.postRegister(req, res, next);
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).send('Error al registrar usuario');
    }
});

// 🔹 Cerrar sesión
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login');
    });
});

// ============================
// 🚀 RUTA DESPUÉS DEL LOGIN (redirige a /home)
// ============================

// Ya no se usa /layouts ni /products desde aquí.
// El controlador postLogin debe redirigir a /home.

module.exports = router;
