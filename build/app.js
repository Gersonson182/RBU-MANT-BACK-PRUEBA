"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const route_1 = __importDefault(require("./routes/test-connection/route"));
const index_1 = require("./routes/auth/index");
const index_2 = require("./routes/ordenDeTrabajo/index");
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
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: originPage,
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/api", express_1.default.static("public"));
app.use("/api", route_1.default);
// autentificacion
app.use("/api/auth", index_1.authRouter);
app.use("/api/auth", index_1.authPermissionRouter);
////////////////// Ordenes de trabajo ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.use("/api/ordenDeTrabajo", index_2.OTGeneral);
app.use("/api/ordenDeTrabajo", index_2.filtrosOrdenTrabajo);
// Ordenes de trabajo - Sistemas y sub sistemas
app.use("/api/ordenDeTrabajo", index_2.subSistemas);
// Ordenes de trabajo - Detalles por id de orden
app.use("/api/ordenDeTrabajo", index_2.idOrdenTrabajo);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.default = app;
