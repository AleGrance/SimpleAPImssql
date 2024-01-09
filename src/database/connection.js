import sql from "mssql";
import dotenv from "dotenv";
const result = dotenv.config();

const sqlConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
  server: "localhost",
  port: 37027,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: true, // for azure
    trustServerCertificate: true, // change to true for local dev / self-signed certs
  },
};

export async function getCon() {
  // const pool = await sql.connect(sqlConfig);
  // const result = await pool.request().query("SELECT * FROM PRODUCTO");
  // console.log(result);

  // await sql.connect(
  //   "Server=localhost,37027;Database=enviadortickets;User Id=agrance;Password=Paraguay2024;Encrypt=true;TrustServerCertificate=true"
  // );
  // const result = await sql.query`select * from usuarios`;
  // console.log(result);

  try {
    const pool = await sql.connect(sqlConfig);
    return pool;
  } catch (error) {
    // ... error checks
    console.log(error);
  }
}

export { sql };
