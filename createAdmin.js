// createAdmin.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');

async function run(){
  try{
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/miinventario';
    await mongoose.connect(uri);
    console.log('Conectado a', uri);

    const username = 'admin';
    const plain = 'admin123';

    // borrar si ya existe
    await User.deleteOne({ username });

    const hashed = await bcrypt.hash(plain, 10);
    const u = await User.create({ username, password: hashed });
    console.log('Usuario creado:', { username: u.username, passwordPlain: plain });
    process.exit(0);
  }catch(err){
    console.error(err);
    process.exit(1);
  }
}

run();

