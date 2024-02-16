import express, { json } from 'express';
import recordsRoutes from './routes/records.routes.js';
import config from './config.js';

const app = express();
const port = config.port;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Instanciar las rutas
app.use(recordsRoutes);

// Metodos de index
app.get('/', (req, res) => {
  res.send({app: 'APP - BOT AUTOMATION', client: 'HBSA'})
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})