const User = require('../models/User');
const { validationResult } = require('express-validator');


exports.getLogin = (req, res) => {
res.render('auth/login');
}


exports.postLogin = async (req, res) => {
const errors = validationResult(req);
if(!errors.isEmpty()){
return res.render('auth/login', { errors: errors.array(), old: req.body });
}
const { username, password } = req.body;
const user = await User.findOne({ username });
if(!user) return res.render('auth/login', { error: 'Usuario no encontrado' });
const match = await user.comparePassword(password);
if(!match) return res.render('auth/login', { error: 'Contraseña incorrecta' });
req.session.user = { id: user._id, username: user.username, role: user.role };
res.redirect('/products');
}


exports.logout = (req, res) => {
req.session.destroy(() => {
res.redirect('/auth/login');
});
}