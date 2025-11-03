const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const Product = require('../models/product');

// ============================
// 🔒 Middleware (protege rutas privadas)
// ============================
function authRequired(req, res, next) {
    if (!req.session.user) {
        console.log('⚠️ Intento de acceso sin sesión');
        return res.redirect('/auth/login');
    }
    next();
}

// ============================
// 📦 Configuración de Multer (subida de imágenes)
// ============================
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/uploads'),
    filename: (req, file, cb) => {
        const nombreUnico = Date.now() + path.extname(file.originalname);
        cb(null, nombreUnico);
    }
});
const upload = multer({ storage });

// ============================
// 🧾 Mostrar formulario para agregar producto
// ============================
router.get('/form', authRequired, (req, res) => {
    res.render('products/form', { title: 'Agregar Producto' });
});

// ============================
// 💾 Guardar producto
// ============================
router.post('/', authRequired, upload.single('imagen'), async (req, res) => {
    try {
        const { nombre, precio, descripcion } = req.body;
        const imagen = req.file ? `/uploads/${req.file.filename}` : '/uploads/default.png';

        const nuevoProducto = await Product.create({ nombre, precio, descripcion, imagen });
        console.log('✅ Producto guardado en la BD:', nuevoProducto);

        res.redirect('/products/list');
    } catch (err) {
        console.error('❌ Error al guardar el producto:', err);
        res.status(500).send('Error al guardar el producto');
    }
});

// ============================
// 📋 Mostrar lista de productos
// ============================
router.get('/list', authRequired, async (req, res) => {
    try {
        const productos = await Product.find().lean();

        console.log('🧩 Productos obtenidos desde MongoDB:');
        console.log(productos); // 👈 Aquí vemos qué llega


        res.render('products/list', {
            title: 'Lista de Productos',
            productos
        });
        const imagen = req.file ? `/uploads/${req.file.filename}` : '/uploads/default.png';
    } catch (err) {
        res.status(500).send('Error al cargar los productos');
    }
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
router.get('/edit/:id', authRequired, async (req, res) => {
    try {
        const producto = await Product.findById(req.params.id).lean();
        if (!producto) {
            return res.status(404).send('Producto no encontrado');
        }
        res.render('products/form', { title: 'Editar Producto', producto });
    } catch (err) {
        console.error('❌ Error al cargar producto para editar:', err);
        res.status(500).send('Error interno del servidor');
    }
});
// ==============================
// 🔁 ACTUALIZAR PRODUCTO
// ==============================
router.post('/edit/:id', authRequired, upload.single('imagen'), async (req, res) => {
    try {
        const { nombre, precio, descripcion } = req.body;
        const updateData = { nombre, precio, descripcion };

        // Si se sube una nueva imagen, la actualiza
        if (req.file) {
            updateData.imagen = `/uploads/${req.file.filename}`;
        }

        await Product.findByIdAndUpdate(req.params.id, updateData);
        res.redirect('/products/list');
    } catch (err) {
        console.error('❌ Error al actualizar producto:', err);
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

// ✏️ Editar producto (mostrar formulario)
router.get('/edit/:id', authRequired, async (req, res) => {
    const producto = await Product.findById(req.params.id).lean();
    if (!producto) return res.status(404).send('Producto no encontrado');
    res.render('products/form', { title: 'Editar Producto', producto });
});

// 💾 Actualizar producto
router.post('/edit/:id', authRequired, upload.single('imagen'), async (req, res) => {
    const { nombre, precio, descripcion } = req.body;
    const updateData = { nombre, precio, descripcion };

    if (req.file) updateData.imagen = `/uploads/${req.file.filename}`;

    await Product.findByIdAndUpdate(req.params.id, updateData);
    res.redirect('/products/list');
});

// 🗑️ Eliminar producto
router.get('/delete/:id', authRequired, async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/products/list');
});

module.exports = router;
