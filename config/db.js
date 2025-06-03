const mongoose = require('mongoose');

const conectarDB = async () => {
  try {
    const dbUri = process.env.DB_MONGO //verificar qque la variable de entorno este bien escrita
        if(!dbUri){
            throw new Error('No se ha definido la variable de entorno DB_MONGO')
        }
        await mongoose.connect(dbUri, {
        });
    console.log('✅ MongoDB conectado');
  } catch (error) {
    console.error('❌ Error al conectar MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = conectarDB;
