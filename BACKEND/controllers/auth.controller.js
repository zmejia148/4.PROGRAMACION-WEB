const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.json({ message: "Usuario registrado" });
    } catch (error) {
        res.status(500).json({ error: "Error al registrar" });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ error: "Contraseña incorrecta" });

        // Crear token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1d"
        });

        res.json({
            message: 'Login exitoso',
            token,
            user: {
                id: user._id,
                username: user.username   // ✅ AHORA SÍ
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

