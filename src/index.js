import express, { json } from 'express';
//import recordsRoutes from './routes/records.routes.js';
import destinatariosRoutes from './routes/destinatarios.routes.js';
import contadoresRoutes from './routes/contadores.routes.js';
import embarcacionesRoutes from './routes/embarcaciones.routes.js';
import config from './config.js';

const app = express();
const port = config.port;

//cross access
var allowCrossDomain = function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
};
app.use(allowCrossDomain);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Instanciar las rutas
//app.use(recordsRoutes);
app.use(destinatariosRoutes);
app.use(embarcacionesRoutes);
app.use(contadoresRoutes);



// Metodos de index
app.get('/', (req, res) => {
  res.send({app: 'APP - BOT AUTOMATION', client: 'HBSA'})
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})