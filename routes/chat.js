const express = require('express');
const router = express.Router();

// Middleware para proteger el acceso
function authRequired(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/auth/login');
    }
    next();
}

// Mostrar vista del chat
router.get('/', authRequired, (req, res) => {
    res.render('chat/chat', { // 👈 cambia aquí si está en subcarpeta
        title: 'Chat en tiempo real',
        user: req.session.user
    });
});

module.exports = router;

