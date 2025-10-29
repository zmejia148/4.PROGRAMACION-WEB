const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    precio: { type: Number, required: true },
    imagen: { type: String }
});

module.exports = mongoose.model('Product', productSchema);
