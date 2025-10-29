const User = require('../models/User');
const bcrypt = require('bcrypt');

// Mostrar formulario de login
exports.getLogin = (req, res) => {
    res.render('auth/login');
};

// Procesar login
exports.postLogin = async (req, res) => {
    try {
        const { username, password } = req.body;

        console.log('🔍 Comparando contraseñas:');
        console.log('Ingresada:', password);

        const user = await User.findOne({ username });
        if (!user) {
            console.log('❌ Usuario no encontrado');
            return res.render('auth/login', { error: 'Usuario no encontrado' });
        }

        console.log('Hash guardado:', user.password);

        const match = await bcrypt.compare(password, user.password);
        console.log('Resultado bcrypt.compare:', match);

        if (!match) {
            return res.render('auth/login', { error: 'Contraseña incorrecta' });
        }

        req.session.user = user;
        res.redirect('/products');
    } catch (error) {
        console.error('❌ Error en postLogin:', error);
        res.render('auth/login', { error: 'Error al iniciar sesión' });
    }
};

// Cerrar sesión
exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login');
    });
};

// Mostrar formulario de registro
exports.getRegister = (req, res) => {
    res.render('auth/register');
};

// Procesar registro
exports.postRegister = async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashed = await bcrypt.hash(password, 10);

        await User.create({ username, password: hashed });
        console.log('✅ Usuario registrado:', username);

        res.redirect('/auth/login');
    } catch (error) {
        console.error('❌ Error en postRegister:', error);
        res.render('auth/register', { error: 'Error al registrar usuario' });
    }
};
