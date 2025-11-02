const express = require('express');
const router = express.Router();

// Middleware para proteger acceso solo a usuarios autenticados
function authRequired(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/auth/login');
    }
    next();
}

// Ruta principal del chat
router.get('/', authRequired, (req, res) => {
    res.render('chat', {
        user: req.session.user,
    });
});

module.exports = router;
