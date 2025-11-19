const express = require("express");
const cors = require("cors");
const productsRoutes = require("./routes/products");
const categoriesRoutes = require("./routes/categories");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/products", productsRoutes);
app.use("/api/categories", categoriesRoutes);

app.use((req, res) => {
    res.status(404).json({ error: "Ruta no encontrada" });
});

app.listen(3001, () => {
    console.log("API ejecutándose en http://localhost:3001");
});
