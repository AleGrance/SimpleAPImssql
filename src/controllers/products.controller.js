import { getCon } from "../database/index.js";

export const getProduct = async (req, res) => {
  const pool = await getCon();
  const result = await pool.request().query("SELECT * FROM PRODUCTO");
  console.log(result);

  res.json(result.recordset);
};

export const postProduct = async (req, res) => {
  console.log(req.body);

  try {
    const pool = await getCon();
    const result = await pool
      .request()
      .query(`INSERT INTO PRODUCTO (nombre, descripcion, cantidad) VALUES ('TEST', 'TESTING', 1);`);
    console.log(result);
    res.send({
      msg: "recibido",
    });
  } catch (error) {
    console.log(error.originalError.info);
    res.send({
      msg: error.originalError.info,
    });
  }

  
};
