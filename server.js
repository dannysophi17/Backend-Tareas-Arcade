const app = require('./index');
const PORT = process.env.PORT || 4000;
const HOST = '127.0.0.1';

app.listen(PORT, HOST, () => {
  console.log(`🚀 Servidor corriendo en http://${HOST}:${PORT}`);
});

