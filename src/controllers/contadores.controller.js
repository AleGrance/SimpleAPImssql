import { getCon, poolPromise, sequelize } from "../database/index.js";
import Sequelize from "sequelize";

// GET Contadores/todos (tabla contadores)
export const getContadores = async (req, res) => {
  const pool = await poolPromise;
  const result = await pool.request().query("SELECT * FROM CONTADORES");
  //console.log(result);

  res.json(result.recordset);
};

// GET Contadores/por fecha (tabla contadores)
export const getContadoresByDate = async (req, res) => {
  const body = req.body;
  //console.log(body);

  try {
    const pool = await poolPromise;
    const result = await pool.request()
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

// GET Contadores por fecha ACUMULADO (tabla contadores_acum)
export const getContadoresByDateAcum = async (req, res) => {
  const body = req.body;
  //console.log(body);

  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`SELECT * FROM contadores_acum c
              WHERE c.fecha BETWEEN'${body.fecha_desde} 00:00:00' AND '${body.fecha_hasta} 23:59:59';`);
    //console.log(result);
    res.json(result.recordset);
  } catch (error) {
    console.log(error.originalError.info);
    res.send({
      msg: error.originalError.info,
    });
  }
};

// GET Contadores por fecha DETALLADO (tabla botes)
export const getContadoresByDateDet = async (req, res) => {
  const body = req.body;
  //console.log(body);

  try {
    const pool = await poolPromise;

    // Si no trae el tipo se muestran todos
    if (body.tipo_notificacion == "") {
      const result = await pool.request().query(`SELECT * FROM botes b
      WHERE b.fecha_hora_envio BETWEEN '${body.fecha_desde} 00:00:00' AND '${body.fecha_hasta} 23:59:59';`);
      //console.log(result);
      res.json(result.recordset);
    } else {
      const result = await pool.request().query(`SELECT * FROM botes b
      WHERE b.fecha_hora_envio BETWEEN '${body.fecha_desde} 00:00:00' AND '${body.fecha_hasta} 23:59:59'
      AND tipo_notificacion = '${body.tipo_notificacion}';`);
      //console.log(result);
      res.json(result.recordset);
    }

    //
  } catch (error) {
    console.log(error.originalError.info);
    res.send({
      msg: error.originalError.info,
    });
  }
};

// PAGINATION
// Modelo para la tabla botes
const Botes = sequelize.define("Botes", {
  embarcacion: Sequelize.STRING,
  fecha_hora: Sequelize.DATE,
  referencia: Sequelize.STRING,
  estado: Sequelize.INTEGER,
  fecha_hora: Sequelize.DATE,
  tipo_notificacion: Sequelize.STRING,
  fecha_hora_envio: Sequelize.DATE,
});

export const contadoresFiltered = async (req, res) => {
  console.log(req.body);
  const draw = req.body.draw;
  const start = req.body.start;
  const length = req.body.length;
  const searchValue = req.body.search.value;
  const orderColumnIndex = req.body.order[0].column;
  const orderDir = req.body.order[0].dir;

  var search_keyword = searchValue.replace(/[^a-zA-Z 0-9.]+/g, "").split(" ");

  Botes.count().then((counts) => {
    var condition = "";

    for (var searchable of search_keyword) {
      if (searchable != "") {
        if (condition != "") {
          condition += " OR ";
        }
        condition += " embarcacion like '%" + searchable + "%' OR";
        condition += " referencia like '%" + searchable + "%' OR";
        condition += " tipo_notificacion like '%" + searchable + "%' OR";
        condition += " fecha_hora like '%" + searchable + "%'";
      }
    }

    var result = {
      data: [],
      recordsTotal: 0,
      recordsFiltered: 0,
    };

    if (!counts) {
      return res.json(result);
    }

    result.recordsTotal = counts;

    const orderColumn = req.body.columns[orderColumnIndex].data;
    const order = [[orderColumn, orderDir]];

    Botes.findAndCountAll({
      offset: start,
      limit: length,
      where: Sequelize.literal(condition),
      order: order,
      attributes: { exclude: ["createdAt", "updatedAt"] },
    }).then((response) => {
      result.recordsFiltered = response.count;
      result.data = response.rows;
      res.json(result);
    });
  });
};
