// Libs
import { getCon } from "../database/index.js";
import axios from "axios";
import cron from "node-cron";
import moment from "moment";

// Params
let counter = 0;
let botes = [];
let recipients = [];

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
  console.log("Realizando consulta cronometrada...");
  //getData();
});

// Programación del reset del contador (cada 00:00)
cron.schedule("0 0 * * *", () => {
  counter = 0;
});

// Obtiene los datos y realiza los envios
async function getData() {
  const pool = await getCon();
  const results = await pool.request().query("SELECT * FROM BOTES WHERE ESTADO = 0");
  const resultsRecipients = await pool.request().query("SELECT * FROM DESTINATARIOS");

  botes = results.recordset;
  recipients = resultsRecipients.recordset;

  console.log("Registros obtenidos:", botes.length);
  //console.log(recipients);

  // Recorre los registros
  for (let bote of botes) {
    // Recorre los destinatarios
    for (let item of recipients) {
      const template = bote.tipo_notificacion == "AMARRE" ? "segundo_saludo" : "tercer_saludo";

      if (bote.tipo_notificacion == item.grupo) {
        const msgBody = {
          messaging_product: "whatsapp",
          to: item.numero,
          type: "template",
          template: {
            namespace: "c8ae5f90_307a_ca4c_b8f6_d1e2a2573574",
            language: {
              policy: "deterministic",
              code: "es",
            },
            name: template,
            components: [
              {
                type: "BODY",
                parameters: [
                  {
                    type: "text",
                    text: bote.embarcacion,
                  },
                  {
                    type: "text",
                    text: moment(bote.fecha_hora).format("DD/MM/YYYY HH:mm"),
                  },
                  {
                    type: "text",
                    text: bote.referencia,
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
            //console.log(response.data);
            counter += 1;
          })
          .catch((error) => {
            console.log("Axios error:");
            console.log(error.code);
          });

        //console.log(msgBody);
        console.log(`Mensaje enviado Destinatario: ${item.nombre}`);
        console.log(`Mensaje enviado tipo: ${item.grupo}`);

        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }

    // Actualizar el estado y la fecha de envio del registro (1 registro se envió a todos)
    const results = await pool.request().query(`UPDATE BOTES
    SET estado = 1, fecha_hora_envio = GETDATE()
    WHERE id = ${bote.id};`);
    console.log(`Registro ${bote.id} actualizado.`);
  }

  console.log("Fin del envío");
  console.log("Cantidad enviada", counter);
  insertContadores(counter);
  //updateStatus(botes);
}

// test
getData();

// Inserta el registro de los contadores tras cada envío del combo de mensajes
async function insertContadores(counter) {
  const pool = await getCon();
  const results = await pool
    .request()
    .query(`INSERT INTO contadores (cant_envio, fecha_hora) VALUES (${counter}, GETDATE());`);
  //result = results.recordset;
  // Cerrar la conexión al finalizar la consulta
  await pool.close();
}

// Actualiza el estado de los registros ya enviados para enviar solamente los que no se enviaron
// async function updateStatus(result) {
//   for (let item of result) {
//     const pool = await getCon();
//     const results = await pool.request().query(`UPDATE BOTES
//               SET estado = 1, fecha_hora_envio = GETDATE()
//               WHERE id = ${item.id};`);
//     //result = results.recordset;
//   }
// }

export * from "./connection.js";
