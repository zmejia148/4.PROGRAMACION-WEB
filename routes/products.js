const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const productController = require('../controllers/productController');
const { ensureAuth } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

// Listar productos
router.get('/', ensureAuth, productController.list);

// Formulario para crear producto
router.get('/create', ensureAuth, productController.showForm);

// Crear producto
router.post('/create',
    ensureAuth,
    upload.single('imagen'),
    body('nombre').notEmpty().withMessage('Nombre requerido'),
    body('precio').isFloat({ gt: 0 }).withMessage('Precio debe ser mayor que 0'),
    productController.create
);

// Formulario de edición
router.get('/edit/:id', ensureAuth, productController.editForm);

// Actualizar producto
router.put('/edit/:id',
    ensureAuth,
    upload.single('imagen'),
    body('nombre').notEmpty().withMessage('Nombre requerido'),
    body('precio').isFloat({ gt: 0 }).withMessage('Precio debe ser mayor que 0'),
    productController.update
);

// Eliminar producto
router.delete('/delete/:id', ensureAuth, productController.remove);

// Chat
router.get('/chat', ensureAuth, (req, res) => {
    res.render('chat/chat');
});

module.exports = router;
