module.exports = {
ensureAuth: (req, res, next) => {
if(req.session.user) return next();
res.redirect('/auth/login');
},
ensureGuest: (req, res, next) => {
if(!req.session.user) return next();
res.redirect('/products');
}
}