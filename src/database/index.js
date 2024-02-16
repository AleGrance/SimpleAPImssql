// Libs
import { getCon } from "../database/index.js";
import axios from "axios";
import cron from "node-cron";
import moment from "moment";

// Params
let counter = 0;
let result = [];
let recipients = [
  { name: "Alejandro", number: "595986153301" },
  { name: "Alejandro Corpo", number: "595974107341" },
];

// 360dialog params
const url = "https://waba-v2.360dialog.io/messages";
const headers = {
  "Content-type": "application/json",
  "D360-API-KEY": "0Eb5doP1x4hJXD9UQsuGDPPgAK",
};

/**
 *  Schedule sender
 */

// Programación de los envios (cada 3 min 24/7)
cron.schedule("*/3 * * * *", async () => {
  console.log("Realizando consulta");
  getData();
});

// Programación del reset del contador (cada 00:00)
cron.schedule("0 0 * * *", () => {
  counter = 0;
});

// Obtiene los datos y realiza los envios
async function getData() {
  const pool = await getCon();
  const results = await pool.request().query("SELECT * FROM BOTES WHERE ESTADO = 0");
  result = results.recordset;

  console.log(result);

  for (let res of result) {
    for (let item of recipients) {
      const msgBody = {
        messaging_product: "whatsapp",
        to: item.number,
        type: "template",
        template: {
          namespace: "c8ae5f90_307a_ca4c_b8f6_d1e2a2573574",
          language: {
            policy: "deterministic",
            code: "es_ES",
          },
          name: "barcaza_info",
          components: [
            {
              type: "BODY",
              parameters: [
                {
                  type: "text",
                  text: res.embarcacion,
                },
                {
                  type: "text",
                  text: moment(res.fecha_hora).format("DD-MM-YYYY"),
                },
                {
                  type: "text",
                  text: res.referencia,
                },
              ],
            },
          ],
        },
      };

      await axios
        .post(url, msgBody, { headers })
        .then((response) => {
          console.log("Success:");
          console.log(response.data);
          counter += 1;
        })
        .catch((error) => {
          console.log("Axios error:");
          console.log(error.code);
        });

      //console.log(msgBody);
      console.log(`Mensaje enviado Destinatario: ${item.name}`);

      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }

  console.log("Fin del envío");
  console.log("Cantidad enviada", counter);
  insertContadores(counter);
  updateStatus(result);
}

// test
getData();

// Inserta el registro de los contadores tras cada envío del combo de mensajes
async function insertContadores(counter) {
  // const now = moment();
  // const nowLocal = now.format('YYYY-MM-DD HH:mm');

  const pool = await getCon();
  const results = await pool
    .request()
    .query(`INSERT INTO contadores (cant_envio, fecha_hora) VALUES (${counter}, GETDATE());`);
  result = results.recordset;
}

// Actualiza el estado de los registros ya enviados para enviar solamente los que no se enviaron
async function updateStatus(res) {
  for (let item of res) {
    const pool = await getCon();
    const results = await pool
      .request()
      .query(`UPDATE BOTES SET ESTADO = 1 WHERE id = ${item.id};`);
    result = results.recordset;
  }
}

export * from "./connection.js";
