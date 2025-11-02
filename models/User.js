const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Definición del esquema de usuario
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
});

// Middleware: encripta la contraseña antes de guardar
UserSchema.pre('save', async function (next) {
    // Solo encripta si la contraseña fue modificada o es nueva
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

// Método: compara contraseñas (para login)
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Exportar el modelo
module.exports = mongoose.model('User', UserSchema);
