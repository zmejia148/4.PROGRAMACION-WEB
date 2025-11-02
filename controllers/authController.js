const User = require('../models/User');
const bcrypt = require('bcrypt');

// ============================
// 🧩 FORMULARIO DE LOGIN
// ============================
exports.getLogin = (req, res) => {
    // Si ya está logueado, redirige al home
    if (req.session.user) {
        return res.redirect('/home');
    }
    res.render('auth/login', { title: 'Iniciar sesión' });
};

// ============================
// 🔐 PROCESAR LOGIN
// ============================
exports.postLogin = async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log(`🟡 Intentando login de: ${username}`);

        const user = await User.findOne({ username });
        if (!user) {
            console.log('❌ Usuario no encontrado');
            return res.render('auth/login', { error: 'Usuario no encontrado' });
        }

        const match = await bcrypt.compare(password, user.password);
        console.log('🔑 Coincidencia contraseña:', match);

        if (!match) {
            return res.render('auth/login', { error: 'Contraseña incorrecta' });
        }

        // Guardar usuario en la sesión
        req.session.user = {
            _id: user._id,
            username: user.username
        };

        console.log(`✅ Usuario autenticado: ${user.username}`);

        // Redirigir a la página principal
        res.redirect('/home');
    } catch (error) {
        console.error('❌ Error en postLogin:', error);
        res.render('auth/login', { error: 'Error al iniciar sesión' });
    }
};

// ============================
// 🚪 CERRAR SESIÓN
// ============================
exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login');
    });
};

// ============================
// 🧾 FORMULARIO DE REGISTRO
// ============================
exports.getRegister = (req, res) => {
    res.render('auth/register', { title: 'Registro de usuario' });
};

// ============================
// 🧠 PROCESAR REGISTRO
// ============================
exports.postRegister = async (req, res) => {
    try {
        const { username, password } = req.body;

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.render('auth/register', { error: 'El usuario ya existe' });
        }

        // Hashear la contraseña antes de guardarla
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            username,
            password: hashedPassword
        });

        console.log(`✅ Usuario registrado correctamente: ${username}`);
        res.redirect('/auth/login');
    } catch (error) {
        console.error('❌ Error en postRegister:', error);
        res.render('auth/register', { error: 'Error al registrar usuario' });
    }
};
