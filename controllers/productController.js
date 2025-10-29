const Product = require('../models/Product');
const { validationResult } = require('express-validator');


exports.list = async (req, res) => {
const products = await Product.find().sort({ createdAt: -1 });
res.render('products/list', { products });
}


exports.showForm = (req, res) => {
res.render('products/form', { product: {} });
}


exports.create = async (req, res) => {
const errors = validationResult(req);
if(!errors.isEmpty()){
return res.render('products/form', { errors: errors.array(), product: req.body });
}
const { nombre, precio, descripcion } = req.body;
const imagen = req.file ? req.file.filename : null;
const p = new Product({ nombre, precio, descripcion, imagen });
await p.save();
res.redirect('/products');
}


exports.editForm = async (req, res) => {
const product = await Product.findById(req.params.id);
if(!product) return res.redirect('/products');
res.render('products/form', { product });
}


exports.update = async (req, res) => {
const errors = validationResult(req);
if(!errors.isEmpty()){
return res.render('products/form', { errors: errors.array(), product: req.body });
}
const { nombre, precio, descripcion } = req.body;
const update = { nombre, precio, descripcion };
if(req.file) update.imagen = req.file.filename;
await Product.findByIdAndUpdate(req.params.id, update);
res.redirect('/products');
}


exports.remove = async (req, res) => {
await Product.findByIdAndDelete(req.params.id);
res.redirect('/products');
}