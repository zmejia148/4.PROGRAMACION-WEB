// ============================
// 📦 IMPORTACIONES PRINCIPALES
// ============================
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const morgan = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const { engine } = require('express-handlebars');
const http = require('http');
const socketio = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// ============================
// ⚙️ CONEXIÓN A MONGODB
// ============================
const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/miinventario';
mongoose.connect(dbUri)
    .then(() => console.log('✅ MongoDB conectado'))
    .catch(err => console.error('❌ Error MongoDB:', err));

// ============================
// 🧩 MIDDLEWARES
// ============================
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(require('method-override')('_method'));

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ============================
// 🔐 SESIONES
// ============================
app.use(session({
    secret: process.env.SESSION_SECRET || 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: dbUri }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 horas
}));

// ============================
// 🧱 MOTOR DE PLANTILLAS (sin helper setVar)
// ============================
app.engine('.handlebars', engine({
    defaultLayout: 'main',
    extname: '.handlebars'
}));
app.set('view engine', '.handlebars');
app.set('views', path.join(__dirname, 'views'));

// ============================
// 👤 VARIABLE GLOBAL USUARIO
// ============================
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// ============================
// 🧭 RUTAS PRINCIPALES
// ============================

// Página de inicio y autenticación
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));

// CRUD de productos
app.use('/products', require('./routes/products'));

// Chat en tiempo real
app.use('/chat', require('./routes/chat'));

// ============================
// 💬 SOCKET.IO (CHAT EN TIEMPO REAL)
// ============================
io.on('connection', (socket) => {
    console.log('🟢 Nuevo cliente conectado:', socket.id);

    socket.on('chatMessage', (data) => {
        io.emit('chatMessage', data); // 🔁 Reenvía a todos los conectados
    });

    socket.on('disconnect', () => {
        console.log('🔴 Cliente desconectado:', socket.id);
    });
});

// Permitir acceso global a Socket.io
app.set('io', io);

// ============================
// 🚀 INICIO DEL SERVIDOR
// ============================
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`✅ Servidor escuchando en http://localhost:${PORT}`));
