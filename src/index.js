import express, { json } from 'express';
import productsRoutes from './routes/products.routes.js';
import config from './config.js';

const app = express();
const port = config.port;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Instanciar las rutas
app.use(productsRoutes);

// Metodos de index
app.get('/', (req, res) => {
  res.send({app: 'API - BOT NOTIFICADOR', client: 'HBSA'})
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})