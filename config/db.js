const mongoose = require('mongoose');
require('dotenv').config();


const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/miinventario';


module.exports = async function connectDB(){
try{
await mongoose.connect(dbUri);
console.log('MongoDB conectado desde config');
}catch(err){
console.error('Error al conectar MongoDB', err);
process.exit(1);
}
}