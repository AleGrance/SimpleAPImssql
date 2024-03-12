import { getCon, poolPromise } from "../database/index.js";

// GET Embarcaciones
export const getEmbarcaciones = async (req, res) => {
  const pool = await poolPromise;
  const result = await pool.request().query("SELECT * FROM Embarcaciones");
  //console.log(result);

  res.json(result.recordset);
  
  
};

// GET Embarcaciones Activas
export const getEmbarcacionesActivas = async (req, res) => {
  const pool = await poolPromise;
  const result = await pool.request().query("SELECT * FROM Embarcaciones WHERE estado = 1");
  //console.log(result);

  res.json(result.recordset);
  
  
};

// POST Embarcaciones
export const postEmbarcacion = async (req, res) => {
  const body = req.body;
  //console.log(body);

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .query(
        `INSERT INTO embarcaciones (nombre, estado) VALUES ('${body.nombre}', 1);`
      );
    //console.log(result);
    res.send({
      msg: "Embarcacion insertado con éxito.",
    });
    
    
  } catch (error) {
    console.log(error.originalError.info);
    res.send({
      msg: error.originalError.info,
    });
  }
};

// PUT Embarcaciones
export const putEmbarcacion = async (req, res) => {
  const body = req.body;
  const idEmbarcacion = req.params.id;
  //console.log(body, idEmbarcacion);

  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`UPDATE embarcaciones
              SET nombre = '${body.nombre}', estado ='${body.estado}'
              WHERE id = ${idEmbarcacion};`);
    //console.log(result);
    res.send({
      msg: "Embarcacion actualizado con éxito.",
    });
  } catch (error) {
    console.log(error.originalError.info);
    res.send({
      msg: error.originalError.info,
    });
  }
};
