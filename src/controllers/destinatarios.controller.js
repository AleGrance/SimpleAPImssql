import { getCon } from "../database/index.js";

// GET Destinatarios
export const getDestinatarios = async (req, res) => {
  const pool = await getCon();
  const result = await pool.request().query("SELECT * FROM DESTINATARIOS");
  //console.log(result);

  res.json(result.recordset);
};

// POST Destinatarios
export const postDestinatario = async (req, res) => {
  const body = req.body;
  //console.log(body);

  try {
    const pool = await getCon();
    const result = await pool
      .request()
      .query(`INSERT INTO DESTINATARIOS (nombre, numero, grupo) VALUES ('${body.nombre}', '${body.numero}', '${body.grupo}');`);
    //console.log(result);
    res.send({
      msg: "Destinatario insertado con éxito.",
    });
  } catch (error) {
    console.log(error.originalError.info);
    res.send({
      msg: error.originalError.info,
    });
  }

  
};

// PUT Destinatarios
export const putDestinatario = async (req, res) => {
  const body = req.body;
  const idDestinatario = req.params.id;
  //console.log(body, idDestinatario);

  try {
    const pool = await getCon();
    const result = await pool
      .request()
      .query(`UPDATE DESTINATARIOS
              SET nombre = '${body.nombre}', numero = '${body.numero}', grupo ='${body.grupo}'
              WHERE id = ${idDestinatario};`);
    //console.log(result);
    res.send({
      msg: "Destinatario actualizado con éxito.",
    });
  } catch (error) {
    console.log(error.originalError.info);
    res.send({
      msg: error.originalError.info,
    });
  }

  
};