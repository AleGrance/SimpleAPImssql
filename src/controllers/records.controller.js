import { getCon } from "../database/index.js";

// GET Records
export const getRecords = async (req, res) => {
  const pool = await getCon();
  const result = await pool.request().query("SELECT * FROM REPORTES");
  console.log(result);

  res.json(result.recordset);
};

// POST Record
export const postRecord = async (req, res) => {
  console.log(req.body);

  try {
    const pool = await getCon();
    const result = await pool
      .request()
      .query(`INSERT INTO REPORTES (nombre, detalle, fecha) VALUES ('Record', 'Record Details', '2024-01-01');`);
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
