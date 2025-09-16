"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConfigMant = void 0;
const env_1 = require("./env");
exports.dbConfigMant = {
    user: env_1.DB_MANT_USER,
    password: env_1.DB_MANT_PASSWORD,
    server: env_1.DB_MANT_SERVER,
    database: env_1.DB_MANT_DATABASE,
    port: env_1.DB_MANT_PORT,
    options: {
        encrypt: true,
        trustServerCertificate: true,
        packetSize: 16368,
    },
    requestTimeout: 60000,
};
