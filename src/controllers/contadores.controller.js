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
    const result = await pool.request()
      .query(`SELECT SUM(c.cant_envio) AS TOTAL_ENVIO FROM contadores c
              WHERE c.fecha_hora BETWEEN '${body.fecha_desde} 00:00:00' AND '${body.fecha_hasta} 23:59:59';`);
    //console.log(result);
    res.json(result.recordset);
    // Cerrar la conexión al finalizar la consulta
    await pool.close();
  } catch (error) {
    console.log(error.originalError.info);
    res.send({
      msg: error.originalError.info,
    });
  }
};

// GET Contadores por fecha ACUMULADO
export const getContadoresByDateAcum = async (req, res) => {
  const body = req.body;
  //console.log(body);

  try {
    const pool = await getCon();
    const result = await pool.request()
      .query(`SELECT b.tipo_notificacion, COUNT(*) AS total_envio FROM botes b
              WHERE b.fecha_hora_envio BETWEEN '${body.fecha_desde} 00:00:00' AND '${body.fecha_hasta} 23:59:59'
              GROUP BY b.tipo_notificacion;`);
    //console.log(result);
    res.json(result.recordset);
    // Cerrar la conexión al finalizar la consulta
    await pool.close();
  } catch (error) {
    console.log(error.originalError.info);
    res.send({
      msg: error.originalError.info,
    });
  }
};

// GET Contadores por fecha DETALLADO
export const getContadoresByDateDet = async (req, res) => {
  const body = req.body;
  console.log(body);

  try {
    const pool = await getCon();

    // Si no trae el tipo se muestran todos
    if (body.tipo_notificacion == "") {
      const result = await pool.request().query(`SELECT * FROM botes b
      WHERE b.fecha_hora_envio BETWEEN '${body.fecha_desde} 00:00:00' AND '${body.fecha_hasta} 23:59:59';`);
      //console.log(result);
      res.json(result.recordset);
      await pool.close();
    } else {
      console.log("no vacio");
      const result = await pool.request().query(`SELECT * FROM botes b
      WHERE b.fecha_hora_envio BETWEEN '${body.fecha_desde} 00:00:00' AND '${body.fecha_hasta} 23:59:59'
      AND tipo_notificacion = '${body.tipo_notificacion}';`);
      //console.log(result);
      res.json(result.recordset);
      await pool.close();
    }

    // // Cerrar la conexión al finalizar la consulta
  } catch (error) {
    console.log(error.originalError.info);
    res.send({
      msg: error.originalError.info,
    });
  }
};
