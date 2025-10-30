const mongoose = require('mongoose');

// Definir el esquema del producto
const productSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre del producto es obligatorio'],
        trim: true
    },
    precio: {
        type: Number,
        required: [true, 'El precio es obligatorio'],
        min: [0, 'El precio no puede ser negativo']
    },
    descripcion: {
        type: String,
        required: [true, 'La descripción es obligatoria'],
        trim: true
    },
    imagen: {
        type: String, // Guardará la ruta o nombre del archivo de imagen
        default: 'default.png'
    },
    fechaCreacion: {
        type: Date,
        default: Date.now
    }
});

// Crear y exportar el modelo
module.exports = mongoose.model('Product', productSchema);
