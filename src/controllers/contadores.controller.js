import { getCon } from "../database/index.js";

// GET Contadores
export const getContadores = async (req, res) => {
  const pool = await getCon();
  const result = await pool.request().query("SELECT * FROM CONTADORES");
  //console.log(result);

  res.json(result.recordset);
};

// GET Contadores por fecha
export const getContadoresByDate = async (req, res) => {
  const body = req.body;
  //console.log(body);

  try {
    const pool = await getCon();
    const result = await pool
      .request()
      .query(`SELECT SUM(c.cant_envio) AS TOTAL_ENVIO FROM contadores c
              WHERE c.fecha_hora BETWEEN '${body.fecha_desde} 00:00:00' AND '${body.fecha_hasta} 23:59:59';`);
    //console.log(result);
    res.json(result.recordset);

  } catch (error) {
    console.log(error.originalError.info);
    res.send({
      msg: error.originalError.info,
    });
  }

  
};
