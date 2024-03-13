import { getCon, poolPromise, sequelize } from "../database/index.js";
import Sequelize from "sequelize";

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

// DELETE Embarcaciones
export const deleteEmbarcacion = async (req, res) => {
  const body = req.body;
  const idEmbarcacion  = req.params.id;
  //console.log(body, idDestinatario);

  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`DELETE FROM EMBARCACIONES WHERE id = ${idEmbarcacion};`);
    //console.log(result);
    res.send({
      msg: "Embarcación eliminada con éxito.",
    });
  } catch (error) {
    console.log(error.originalError.info);
    res.send({
      msg: error.originalError.info,
    });
  }
};

// PAGINATION
// Modelo para la tabla Embarcaciones
const Embarcaciones = sequelize.define("Embarcaciones", {
  nombre: Sequelize.STRING,
  estado: Sequelize.INTEGER,
});

export const embarcacionesFiltered = async (req, res) => {
  const draw = req.body.draw;
  const start = req.body.start;
  const length = req.body.length;
  const searchValue = req.body.search.value;
  const orderColumnIndex = req.body.order[0].column;
  const orderDir = req.body.order[0].dir;

  var search_keyword = searchValue.replace(/[^a-zA-Z 0-9.]+/g, "").split(" ");

  Embarcaciones.count().then((counts) => {
    var condition = "";

    for (var searchable of search_keyword) {
      if (searchable != "") {
        if (condition != "") {
          condition += " OR ";
        }
        condition += " nombre like '%" + searchable + "%'";
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

    Embarcaciones.findAndCountAll({
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

