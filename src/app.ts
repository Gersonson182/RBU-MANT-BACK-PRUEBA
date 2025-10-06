import express from "express";
import cors from "cors";

import testConnectionRouter from "./routes/test-connection/route";

import { authRouter, authPermissionRouter } from "./routes/auth/index";

import {
  OTGeneral,
  filtrosOrdenTrabajo,
  subSistemas,
  idOrdenTrabajo,
  idRelacionFalla,
  codigoBus,
  codigoFlota,
} from "./routes/ordenDeTrabajo/index";

const originPage = [
  "http://localhost:5173",
  "http://localhost:5180",
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

////////////////// Ordenes de trabajo ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.use("/api/ordenDeTrabajo", OTGeneral);
app.use("/api/ordenDeTrabajo", filtrosOrdenTrabajo);

// Ordenes de trabajo - Sistemas y sub sistemas
app.use("/api/ordenDeTrabajo", subSistemas);

// Ordenes de trabajo - Detalles por id de orden
app.use("/api/ordenDeTrabajo", idOrdenTrabajo);

// Eliminar una falla por id de relación falla
app.use("/api/ordenDeTrabajo", idRelacionFalla);

// Buscar mantención preventiva por numero de bus o placa paternte
app.use("/api/ordenDeTrabajo", codigoBus);

// Rellenar selector de siglas preventivas por código de flota
app.use("/api/ordenDeTrabajo", codigoFlota);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export default app;
