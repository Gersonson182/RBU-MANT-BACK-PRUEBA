import { ConnectionPool } from "mssql";
import { dbConfigMant } from "../config/db";

let pool: ConnectionPool | null = null;

export const connectDB = async (): Promise<ConnectionPool> => {
  if (!pool) {
    try {
      pool = await new ConnectionPool(dbConfigMant).connect();
    } catch {
      throw new Error("Error connecting to MANT database");
    }
  }
  return pool;
};

export const isDBConnected = async (): Promise<boolean> => {
  try {
    const pool = await connectDB();
    await pool.request().query("SELECT 1");
    return true;
  } catch {
    return false;
  }
};
