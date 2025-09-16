import { config } from "mssql";
import {
  DB_MANT_USER,
  DB_MANT_PASSWORD,
  DB_MANT_SERVER,
  DB_MANT_DATABASE,
  DB_MANT_PORT,
} from "./env";

export const dbConfigMant: config = {
  user: DB_MANT_USER,
  password: DB_MANT_PASSWORD,
  server: DB_MANT_SERVER,
  database: DB_MANT_DATABASE,
  port: DB_MANT_PORT,
  options: {
    encrypt: true,
    trustServerCertificate: true,
    packetSize: 16368,
  },
  requestTimeout: 60000,
};
