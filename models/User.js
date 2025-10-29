const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const UserSchema = new mongoose.Schema({
username: { type: String, required: true, unique: true },
password: { type: String, required: true },
role: { type: String, default: 'user' }
});


UserSchema.pre('save', async function(next){
if(!this.isModified('password')) return next();
const salt = await bcrypt.genSalt(10);
this.password = await bcrypt.hash(this.password, salt);
next();
});


UserSchema.methods.comparePassword = function(candidate){
return bcrypt.compare(candidate, this.password);
}


module.exports = mongoose.model('User', UserSchema);