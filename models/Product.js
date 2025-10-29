const mongoose = require('mongoose');


const ProductSchema = new mongoose.Schema({
nombre: { type: String, required: true },
precio: { type: Number, required: true },
descripcion: { type: String },
imagen: { type: String }
}, { timestamps: true });


module.exports = mongoose.model('Product', ProductSchema);