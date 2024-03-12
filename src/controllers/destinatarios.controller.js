import { getCon, poolPromise, sequelize } from "../database/index.js";
import Sequelize from "sequelize";

// GET Destinatarios
export const getDestinatarios = async (req, res) => {
  const pool = await poolPromise;
  const result = await pool.request().query("SELECT * FROM DESTINATARIOS");
  //console.log(result);

  res.json(result.recordset);
};

// POST Destinatarios
export const postDestinatario = async (req, res) => {
  const body = req.body;
  //console.log(body);

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .query(
        `INSERT INTO DESTINATARIOS (nombre, numero, grupo, embarcacion) VALUES ('${body.nombre}', '${body.numero}', '${body.grupo}', '${body.embarcacion}');`
      );
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
    const pool = await poolPromise;
    const result = await pool.request().query(`UPDATE DESTINATARIOS
              SET nombre = '${body.nombre}', numero = '${body.numero}', grupo ='${body.grupo}', embarcacion ='${body.embarcacion}'
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

// PAGINATION
// Modelo para la tabla Destinatarios
const Destinatarios = sequelize.define("Destinatarios", {
  nombre: Sequelize.STRING,
  numero: Sequelize.STRING,
  grupo: Sequelize.STRING,
  embarcacion: Sequelize.STRING,
});

export const destinatariosFiltered = async (req, res) => {
  const draw = req.body.draw;
  const start = req.body.start;
  const length = req.body.length;
  const searchValue = req.body.search.value;
  const orderColumnIndex = req.body.order[0].column;
  const orderDir = req.body.order[0].dir;

  var search_keyword = searchValue.replace(/[^a-zA-Z 0-9.]+/g, "").split(" ");

  Destinatarios.count().then((counts) => {
    var condition = "";

    for (var searchable of search_keyword) {
      if (searchable != "") {
        if (condition != "") {
          condition += " OR ";
        }
        condition += " nombre like '%" + searchable + "%' OR";
        condition += " numero like '%" + searchable + "%' OR";
        condition += " embarcacion like '%" + searchable + "%' OR";
        condition += " grupo like '%" + searchable + "%'";
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

    Destinatarios.findAndCountAll({
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

