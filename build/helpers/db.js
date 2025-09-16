"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDBConnected = exports.connectDB = void 0;
const mssql_1 = require("mssql");
const db_1 = require("../config/db");
let pool = null;
const connectDB = async () => {
    if (!pool) {
        try {
            pool = await new mssql_1.ConnectionPool(db_1.dbConfigMant).connect();
        }
        catch {
            throw new Error("Error connecting to MANT database");
        }
    }
    return pool;
};
exports.connectDB = connectDB;
const isDBConnected = async () => {
    try {
        const pool = await (0, exports.connectDB)();
        await pool.request().query("SELECT 1");
        return true;
    }
    catch {
        return false;
    }
};
exports.isDBConnected = isDBConnected;
