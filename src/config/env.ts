import { config } from "dotenv";

config();

export const PORT = process.env.PORT || 4020;

export const DB_MANT_USER = process.env.DB_MANT_USER as string;
export const DB_MANT_PASSWORD = process.env.DB_MANT_PASSWORD as string;
export const DB_MANT_SERVER = process.env.DB_MANT_SERVER as string;
export const DB_MANT_DATABASE = process.env.DB_DATABASE as string;
export const DB_MANT_PORT = parseInt(
  process.env.DB_PORT || "2021",
  10
) as number;
