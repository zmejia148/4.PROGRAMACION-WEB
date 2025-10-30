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


// Config DB
const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/miinventario';
mongoose.connect(dbUri)
.then(()=> console.log('MongoDB conectado'))
.catch(err => console.error('Error MongoDB:', err));


// Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(require('method-override')('_method'));
app.use(express.static(path.join(__dirname,'public')));
app.use('/uploads', express.static(path.join(__dirname,'uploads')));


// Session
app.use(session({
secret: process.env.SESSION_SECRET || 'keyboard cat',
resave: false,
saveUninitialized: false,
store: MongoStore.create({ mongoUrl: dbUri }),
cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));


// View engine
app.engine('handlebars', engine({ defaultLayout: 'main', extname: '.handlebars' }));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname,'views'));


// Global user for views
app.use((req, res, next) => {
res.locals.user = req.session.user || null;
next();
});


// Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth.js'));
app.use('/products', require('./routes/products'));


// Socket.io
io.on('connection', socket => {
console.log('Nuevo cliente conectado', socket.id);
socket.on('chatMessage', data => {
// emitir a todos
io.emit('chatMessage', data);
});
socket.on('disconnect', ()=> console.log('Cliente desconectado', socket.id));
});


// Expose io to routes/controllers via app.set
app.set('io', io);


const PORT = process.env.PORT || 3000;
server.listen(PORT, ()=> console.log(`Server escuchando en puerto ${PORT}`));

