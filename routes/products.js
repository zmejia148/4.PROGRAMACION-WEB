const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Producto = require('../models/Product');

// Configuración de Multer (subida de imágenes)
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/uploads'),
    filename: (req, file, cb) => {
        const nombreUnico = Date.now() + path.extname(file.originalname);
        cb(null, nombreUnico);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // máximo 5MB
    fileFilter: (req, file, cb) => {
        const tiposPermitidos = /jpeg|jpg|png|gif/;
        const mimetype = tiposPermitidos.test(file.mimetype);
        const extname = tiposPermitidos.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) return cb(null, true);
        cb('Error: solo se permiten imágenes JPG, PNG o GIF.');
    }
});

// Mostrar formulario de nuevo producto
router.get('/nuevo', (req, res) => {
    if (!req.session.usuario) return res.redirect('/auth/login');
    res.render('product/nuevo');
});

// Crear producto
router.post('/', upload.single('imagen'), async (req, res) => {
    try {
        const { nombre, precio, descripcion } = req.body;
        const imagen = req.file ? `/uploads/${req.file.filename}` : 'default.png';
        await Producto.create({ nombre, precio, descripcion, imagen });
        res.redirect('/productos');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al guardar el producto');
    }
});

// Listar productos
router.get('/', async (req, res) => {
    if (!req.session.usuario) return res.redirect('/auth/login');
    const productos = await Producto.find().lean();
    res.render('productos/lista', { productos });
});

module.exports = router;
