const express = require('express');
const router = express.Router();

// 🧱 Middleware para proteger rutas privadas
function authRequired(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/auth/login');
    }
    next();
}

// 🏠 Página de inicio
router.get('/', (req, res) => {
    if (req.session.user) {
        // Si ya inició sesión, lo redirigimos al home
        return res.redirect('/home');
    }
    // Si no tiene sesión, enviamos al login
    return res.redirect('/auth/login');
});

// 🏡 Página de bienvenida después del login
router.get('/home', authRequired, (req, res) => {
    res.render('home', {
        title: 'Inicio',
        user: req.session.user,
        loggedIn: true
    });
});

module.exports = router;
