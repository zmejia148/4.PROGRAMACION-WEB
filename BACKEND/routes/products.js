const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// GET todos los productos
router.get("/", async (req, res) => {
    const productos = await Product.find();
    res.json(productos);
});

// GET producto por id
router.get("/:id", async (req, res) => {
    const producto = await Product.findById(req.params.id);
    if (!producto) return res.status(404).json({ error: "Producto no encontrado" });
    res.json(producto);
});

// POST crear producto
router.post("/", async (req, res) => {
    const { nombre, precio, descripcion } = req.body;
    if (!nombre || !precio)
        return res.status(400).json({ error: "Nombre y precio son obligatorios" });

    const nuevo = new Product({ nombre, precio, descripcion });
    await nuevo.save();

    res.status(201).json({ message: "Producto creado", data: nuevo });
});

// PUT actualizar producto
router.put("/:id", async (req, res) => {
    const actualizado = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    if (!actualizado)
        return res.status(404).json({ error: "Producto no encontrado" });

    res.json({ message: "Producto actualizado", data: actualizado });
});

// DELETE eliminar producto
router.delete("/:id", async (req, res) => {
    const eliminado = await Product.findByIdAndDelete(req.params.id);
    if (!eliminado)
        return res.status(404).json({ error: "Producto no encontrado" });

    res.json({ message: "Producto eliminado" });
});

module.exports = router;
