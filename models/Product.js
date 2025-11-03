const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    precio: { type: Number, required: true },
    descripcion: { type: String },
    imagen: { type: String, default: '/uploads/default.png' } // 👈 Imagen por defecto
});

module.exports = mongoose.model('Product', productSchema);
