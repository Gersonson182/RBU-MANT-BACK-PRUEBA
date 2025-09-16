import express from "express";
import cors from "cors";

import testConnectionRouter from "./routes/test-connection/route";

import { authRouter, authPermissionRouter } from "./routes/auth/index";

const originPage = [
  "http://localhost:5173",
  "https://mantenimiento.rbu.cl",
  "https://planificacion.rbu.cl",
  "http://planificacion.rbu.cl",
  "http://mantenimiento.rbu.cl",
  "http://localhost:5174",
  "https://pruebas3.rbu.cl",
  "http://192.168.70.13:2077",
];

const app = express();

app.use(
  cors({
    origin: originPage,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", express.static("public"));
app.use("/api", testConnectionRouter);

// autentificacion

app.use("/api/auth", authRouter);
app.use("/api/auth", authPermissionRouter);

export default app;
