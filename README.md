**** ZAIDA MEJIA 
*** CUARTO SEMESTRE

# 🧾 MiInventarioExpress

**MiInventarioExpress** es una aplicación web desarrollada con **Node.js, Express, MongoDB y Handlebars**, que permite la **gestión de productos** y la **comunicación en tiempo real mediante un chat integrado**.

El sistema está diseñado para facilitar la administración de inventarios, con control de usuarios y una interfaz visual amigable e intuitiva.

## 🚀 Características principales

### 🔐 Autenticación de usuarios
- Registro e inicio de sesión con validación de credenciales.
- Encriptación de contraseñas mediante `bcrypt`.
- Manejo de sesiones con `express-session` y `connect-mongo`.

### 📦 Gestión de productos (CRUD)
- Crear, editar, listar y eliminar productos.
- Subida de imágenes con `multer`.
- Visualización uniforme de imágenes en tarjetas (cards adaptativas).
- Interfaz organizada con Bootstrap y estilos personalizados.

### 💬 Chat en tiempo real
- Implementación con **Socket.io**.
- Comunicación instantánea entre los usuarios conectados.
- Identificación por nombre de usuario.

## 🛠️ Tecnologías utilizadas

| Categoría | Tecnologías |
|------------|-------------|
| **Backend** | Node.js, Express.js |
| **Frontend** | Handlebars, Bootstrap 5, CSS3 |
| **Base de datos** | MongoDB (con Mongoose ORM) |
| **Autenticación** | bcrypt, express-session, connect-mongo |
| **Tiempo real** | Socket.io |
| **Subida de archivos** | Multer |
| **Motor de vistas** | express-handlebars |



## ⚙️ Instalación y ejecución

### 1️⃣ Clonar el repositorio
```bash
git clone https://github.com/usuario/MiInventarioExpress.git
cd MiInventarioExpress

**Instalar dependencias
npm install

**Configurar variables de entorno en archivo .env
MONGODB_URI=mongodb://localhost:27017/miinventario
SESSION_SECRET=miclave123
PORT=3000

**Ejecutar el servidor
npm run dev

**Abrir en el navegador
http://localhost:3000
