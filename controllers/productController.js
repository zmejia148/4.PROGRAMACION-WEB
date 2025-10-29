const Product = require('../models/Product');

// Listar productos
exports.list = async (req, res) => {
    try {
        const products = await Product.find().lean();
        res.render('products/list', { products });
    } catch (error) {
        console.error('Error al listar productos:', error);
        res.render('error', { error: 'No se pudieron cargar los productos' });
    }
};

// Mostrar formulario de creación
exports.showForm = (req, res) => {
    res.render('products/create');
};

// Crear producto
exports.create = async (req, res) => {
    try {
        const { nombre, precio } = req.body;
        const imagen = req.file ? req.file.filename : null;

        await Product.create({ nombre, precio, imagen });
        res.redirect('/products');
    } catch (error) {
        console.error('Error al crear producto:', error);
        res.render('products/create', { error: 'Error al crear el producto' });
    }
};

// Mostrar formulario de edición
exports.editForm = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).lean();
        res.render('products/edit', { product });
    } catch (error) {
        console.error('Error al obtener producto:', error);
        res.redirect('/products');
    }
};

// Actualizar producto
exports.update = async (req, res) => {
    try {
        const { nombre, precio } = req.body;
        const updateData = { nombre, precio };

        if (req.file) updateData.imagen = req.file.filename;

        await Product.findByIdAndUpdate(req.params.id, updateData);
        res.redirect('/products');
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.redirect('/products');
    }
};

// Eliminar producto
exports.remove = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.redirect('/products');
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.redirect('/products');
    }
};
