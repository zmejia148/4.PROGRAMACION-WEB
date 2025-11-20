const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Rutas
app.use("/api/productos", require("./routes/products"));

// Conectar a MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/mercapp")
    .then(() => console.log("MongoDB conectado ✔"))
    .catch(err => console.log("Error MongoDB:", err));

// Iniciar servidor
app.listen(3000, () => {
    console.log("Servidor iniciado en http://localhost:3000");
});
