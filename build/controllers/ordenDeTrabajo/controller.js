"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = void 0;
const db_1 = require("../../helpers/db");
const services_1 = require("../../services/ordenDeTrabajo/services");
const GET = async (req, res) => {
    try {
        const pool = await (0, db_1.connectDB)();
        const nroOT = req.query.nroOT ? Number(req.query.nroOT) : undefined;
        const codTaller = req.query.codTaller
            ? Number(req.query.codTaller)
            : undefined;
        const nroBus = req.query.nroBus ? Number(req.query.nroBus) : undefined;
        const estadoOT = req.query.estadoOT
            ? Number(req.query.estadoOT)
            : undefined;
        const tipoOT = req.query.tipoOT ? Number(req.query.tipoOT) : undefined;
        const fechaIngreso = req.query.fechaIngreso;
        const fechaSalida = req.query.fechaSalida;
        const nroManager = req.query.nroManager
            ? Number(req.query.nroManager)
            : undefined;
        const pagina = req.query.pagina ? Number(req.query.pagina) : 0;
        // llamada al service
        const { data, total } = await (0, services_1.getOrdenesTrabajo)({
            pool,
            nroOT,
            codTaller,
            nroBus,
            estadoOT,
            tipoOT,
            fechaIngreso,
            fechaSalida,
            nroManager,
            pagina,
        });
        // respuesta al cliente
        res.json({
            total,
            data,
        });
    }
    catch (error) {
        console.error("Error en getOrdenesTrabajoController:", error);
        res.status(500).json({
            message: "Error al obtener órdenes de trabajo",
            error: error.message,
        });
    }
};
exports.GET = GET;
