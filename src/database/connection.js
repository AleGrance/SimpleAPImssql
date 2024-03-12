import sql from "mssql";
import dotenv from "dotenv";
const result = dotenv.config();
import Sequelize from "sequelize";

const sqlConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
  server: process.env.DB_SERVER,
  port: parseInt(process.env.DB_PORT),
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: false, // for azure
    trustServerCertificate: true, // change to true for local dev / self-signed certs
  },
};

// OPCION 1
export async function getCon() {
  try {
    const pool = await sql.connect(sqlConfig);
    
    return pool;
  } catch (error) {
    // ... error checks
    console.log(error);
  }
}

// OPCION 2
const poolPromise = await sql.connect(sqlConfig);

// Conexión usando Sequelize
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PWD, {
  dialect: 'mssql',
  host: process.env.DB_SERVER,
  port: parseInt(process.env.DB_PORT),
  dialectOptions: {
    options: {
      encrypt: false, // Usar en caso de conexión segura (SSL/TLS)
    },
  },
})

export { sql, poolPromise, sequelize };
