import { config } from "dotenv"
config();

export default {
    port: process.env.APP_PORT || 3000
}
