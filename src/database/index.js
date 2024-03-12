// Libs
import { getCon, poolPromise } from "../database/index.js";
import axios from "axios";
import cron from "node-cron";
import moment from "moment";

// 360dialog params
const url = "https://waba-v2.360dialog.io/messages";
const headers = {
  "Content-type": "application/json",
  //"D360-API-KEY": "0Eb5doP1x4hJXD9UQsuGDPPgAK",
  "D360-API-KEY": "KjK54tUkyYSPUAnDaTRbnHeuAK",
};

/**
 *  Schedule sender
 */

// Programación de los envios (cada 3 min 24/7)
cron.schedule("*/3 * * * *", async () => {
  console.log("Realizando consulta cronometrada...");
  //getData();
});

// Programación insersión de los contadores acumulados (cada 00:00)
cron.schedule("0 0 * * *", () => {
  insertContadoresAcum();
});

// Obtiene los datos y realiza los envios
async function getData() {
  let counter = 0;

  const pool = await poolPromise;
  const results = await pool.request().query("SELECT * FROM botes WHERE ESTADO = 0");
  const resultsRecipients = await pool.request().query("SELECT * FROM destinatarios");

  const botes = results.recordset;
  const destinatarios = resultsRecipients.recordset;

  console.log("Pendientes de envio:", botes.length);
  //console.log(recipients);

  if (botes.length > 0) {
    // Recorre los registros
    for (let bote of botes) {
      // Recorre los destinatarios
      for (let destinatario of destinatarios) {
        //const template = bote.tipo_notificacion == "AMARRE" ? "segundo_saludo" : "tercer_saludo";
        const template =
          bote.tipo_notificacion == "AMARRE" ? "first_notification" : "second_notification";

        if (
          bote.tipo_notificacion == destinatario.grupo &&
          destinatario.embarcacion.includes(bote.embarcacion)
        ) {
          const msgBody = {
            messaging_product: "whatsapp",
            to: destinatario.numero,
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
          console.log(`Mensaje enviado Destinatario: ${destinatario.nombre}`);
          console.log(`Mensaje enviado tipo: ${destinatario.grupo}`);

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
  }
}

// test
//getData();

// Inserta el registro de los contadores tras cada envío del combo de mensajes
async function insertContadores(counter) {
  const pool = await poolPromise;
  const results = await pool
    .request()
    .query(`INSERT INTO contadores (cant_envio, fecha_hora) VALUES (${counter}, GETDATE());`);
  //result = results.recordset;
}

// Inserta el registro de los contadores acum
async function insertContadoresAcum() {
  const now = moment();
  const nowLocal = now.format("YYYY-MM-DD");

  const pool = await poolPromise;
  try {
    const results = await pool.request()
      .query(`SELECT b.tipo_notificacion, COUNT(*) AS total_envio FROM botes b
    WHERE b.fecha_hora_envio BETWEEN '${nowLocal} 00:00:00' AND '${nowLocal} 23:59:59'
    GROUP BY b.tipo_notificacion;`);
    const contadoresAcum = results.recordset;
    console.log("los contadores", contadoresAcum);

    for (let item of contadoresAcum) {
      const insertion = await pool.request().query(`INSERT INTO contadores_acum (
        total_envio,
        tipo_notificacion,
        fecha)
      VALUES(${item.total_envio}, '${item.tipo_notificacion}', GETDATE());`);
    }

    console.log("Se insertaron los contadores");
  } catch (error) {
    console.log("Error en catch", error);
  }
}

export * from "./connection.js";
