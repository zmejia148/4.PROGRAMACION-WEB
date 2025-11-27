# MARCAPP
MERCAPP es una aplicación web desarrollada con Vue.js, Node.js, Express y MongoDB, diseñada para gestionar productos, usuarios con roles, categorías, chat en tiempo real y un carrito de compras dinámico. Es un sistema modular, escalable y construido siguiendo el patrón MVC.

# Características Principales
🔐 Gestión de Usuarios y Roles
Registro e inicio de sesión.
Autenticación con JWT.
Roles: Admin y Usuario.
Control de acceso basado en permisos.
Vistas dinámicas según el rol.
📦 Catálogo de Productos
Visualización de productos con imagen, precio, descripción.
Vista de catálogo accesible para todos los roles.
Vista administrativa para CRUD.
🛒 Carrito de Compras
Agregar productos al carrito.
Ver carrito completo.
Persistencia usando localStorage.
🗃 CRUD Completo de Productos
Crear productos (admin).
Editar productos (admin).
Eliminar productos (admin).
Listar productos (todos los usuarios).
💬 Chat en Tiempo Real
Implementado con Socket.io.
Disponible para cualquier usuario logeado.

# Tecnologías Utilizadas
Frontend
Vue.js 3
Vue Router
Axios
CSS personalizado
Backend
Node.js
Express.js
Mongoose (MongoDB)
JWT (Json Web Token)
Bcrypt
Socket.io
Base de datos
MongoDB Atlas o local

# Estructura del Proyecto
BACKEND/
│── controllers/
│── models/
│── routes/
│── config/
│── server.js
│── .env

FRONTEND/
│── views/
│── components/
│── services/
│── assets/
│── router/
│── App.vue
│── main.js

# Clonar el repositorio
git clone https://github.com/zmejia148/4.PROGRAMACION-WEB/tree/MERCAPP
cd MERCAPP

# USUARIO ADMIN CREAR PARA TENER USUARIO ADMINISTRADOR
1️.  Abrir Postman
2️. Crear una petición POST
POST http://localhost:3000/api/auth/register
3️. Enviar el siguiente JSON en el Body → raw → JSON
{
  "username": "admin",
  "password": "1234", (ESTA CONTRASEÑAS LA PUEDES PERSONALIZAR)
  "role": "admin"
}
4️. Respuesta esperada
{
  "message": "Usuario registrado correctamente"
}

Ahora podrás iniciar sesión con:

Usuario: admin
Contraseña: 1234

# Ejecución del Proyecto
* Backend
cd BACKEND
npm install
node server.js

* Frontend
cd FRONTEND
npm install
npm run serve

# Acceso y Roles
Rol	Permisos
Admin	-> Crear/editar/eliminar productos, gestionar categorías, gestionar usuarios.
Usuario ->	Ver productos, agregar al carrito, usar chat.

