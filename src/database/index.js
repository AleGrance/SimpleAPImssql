// Libs
import { getCon } from "../database/index.js";
import axios from "axios";
import cron from "node-cron";

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

cron.schedule("*/3 * * * *", async () => {
  console.log("Realizando consulta");
  getData();
});

cron.schedule("0 0 * * *", () => {
  //resetCounter();
});

// Functions
async function getData() {
  const pool = await getCon();
  const results = await pool.request().query("SELECT * FROM REPORTES");
  result = results.recordset;

  console.log(result);

  // for (let res of result) {
  //   for (let item of recipients) {
  //     const msgBody = {
  //       messaging_product: "whatsapp",
  //       to: item.number,
  //       type: "template",
  //       template: {
  //         namespace: "c8ae5f90_307a_ca4c_b8f6_d1e2a2573574",
  //         language: {
  //           policy: "deterministic",
  //           code: "es",
  //         },
  //         name: "information",
  //         components: [
  //           {
  //             type: "BODY",
  //             parameters: [
  //               {
  //                 type: "text",
  //                 text: res.nombre,
  //               },
  //               {
  //                 type: "text",
  //                 text: res.descripcion,
  //               },
  //               {
  //                 type: "text",
  //                 text: res.cantidad,
  //               },
  //             ],
  //           },
  //         ],
  //       },
  //     };

  //     await axios
  //       .post(url, msgBody, { headers })
  //       .then((response) => {
  //         console.log("Success:");
  //         console.log(response.data);
  //         counter += 1;
  //       })
  //       .catch((error) => {
  //         console.log("Axios error:");
  //         console.log(error.code);
  //       });

  //     console.log(`Mensaje enviado Destinatario: ${item.name}`);

  //     await new Promise((resolve) => setTimeout(resolve, 3000));
  //   }
  // }

  console.log('Fin del envío');
  console.log('Cantidad enviada', counter);
}

getData();

export * from "./connection.js";
