const express = require('express');
const router = express.Router();

// Middleware para proteger las rutas privadas
function authRequired(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/auth/login');
    }
    next();
}

// Página principal (si no hay sesión)
router.get('/', (req, res) => {
    if (req.session.user) {
        return res.redirect('/home');
    }
    res.render('home', { title: 'Bienvenido a MiInventarioExpress' });
});

// Página de bienvenida después del login
router.get('/home', authRequired, (req, res) => {
    res.render('home', {
        title: 'Inicio',
        user: req.session.user,
        loggedIn: true
    });
});

module.exports = router;
