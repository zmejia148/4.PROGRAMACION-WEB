const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const Product = require('../models/product');

// ==============================
// 🔧 CONFIGURACIÓN DE MULTER
// ==============================
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

// Redirige /products → /products/list
router.get('/', (req, res) => {
    res.redirect('/products/list');
});

// ==============================
// 📋 LISTAR PRODUCTOS
// ==============================
router.get('/list', async (req, res) => {
    const productos = await Product.find().lean();
    res.render('products/list', { title: 'Lista de productos' });
});

// ==============================
// 🧾 MOSTRAR FORMULARIO NUEVO
// ==============================
router.get('/form', (req, res) => {
    res.render('products/form', { title: 'Agregar producto' });
});

// ==============================
// 💾 GUARDAR PRODUCTO NUEVO
// ==============================
router.post('/', upload.single('imagen'), async (req, res) => {
    try {
        const { nombre, precio, descripcion } = req.body;
        const imagen = req.file ? `/uploads/${req.file.filename}` : '/uploads/default.png';

        const nuevoProducto = new Product({ nombre, precio, descripcion, imagen });
        await nuevoProducto.save();

        res.redirect('/products/list');
    } catch (err) {
        console.error('❌ Error al guardar el producto:', err);
        res.status(500).send('Error al guardar el producto');
    }
});

// ==============================
// ✏️ FORMULARIO EDITAR PRODUCTO
// ==============================
router.get('/edit/:id', async (req, res) => {
    try {
        const producto = await Product.findById(req.params.id).lean();
        if (!producto) return res.status(404).send('Producto no encontrado');
        res.render('products/form', { producto, editMode: true });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al cargar el formulario de edición');
    }
});

// ==============================
// 🔁 ACTUALIZAR PRODUCTO
// ==============================
router.post('/edit/:id', upload.single('imagen'), async (req, res) => {
    try {
        const { nombre, precio, descripcion } = req.body;
        const productoActualizado = {
            nombre,
            precio,
            descripcion,
        };
        if (req.file) productoActualizado.imagen = `/uploads/${req.file.filename}`;

        await Product.findByIdAndUpdate(req.params.id, productoActualizado);
        res.redirect('/products/list');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al actualizar el producto');
    }
});

// ==============================
// 🗑️ ELIMINAR PRODUCTO
// ==============================
router.get('/delete/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.redirect('/products/list');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al eliminar el producto');
    }
});

module.exports = router;
