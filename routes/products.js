const express = require("express");
const router = express.Router();
const { v4: uuid } = require("uuid");
const db = require("../data/data.json");
const fs = require("fs");

const saveDb = () => {
    fs.writeFileSync("./data/data.json", JSON.stringify(db, null, 2));
};

// GET all
router.get("/", (req, res) => {
    res.json(db.products);
});

// GET by ID
router.get("/:id", (req, res) => {
    const product = db.products.find(p => p.id === req.params.id);
    if (!product) return res.status(404).json({ error: "Producto no encontrado" });
    res.json(product);
});

// POST create
router.post("/", (req, res) => {
    const { name, description, price, imageUrl, categoryId, stock } = req.body;

    if (!name || !price) {
        return res.status(400).json({ error: "Nombre y precio son obligatorios" });
    }

    const newProduct = {
        id: uuid(),
        name,
        description,
        price,
        imageUrl,
        categoryId,
        stock
    };

    db.products.push(newProduct);
    saveDb();
    res.status(201).json(newProduct);
});

// PUT update
router.put("/:id", (req, res) => {
    const product = db.products.find(p => p.id === req.params.id);
    if (!product) return res.status(404).json({ error: "Producto no encontrado" });

    Object.assign(product, req.body);
    saveDb();

    res.json(product);
});

// DELETE
router.delete("/:id", (req, res) => {
    const index = db.products.findIndex(p => p.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "Producto no encontrado" });

    db.products.splice(index, 1);
    saveDb();

    res.json({ message: "Producto eliminado" });
});

module.exports = router;
