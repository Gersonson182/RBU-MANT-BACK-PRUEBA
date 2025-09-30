"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = void 0;
const db_1 = require("../../helpers/db");
const services_1 = require("../../services/ordenDeTrabajo/services");
const toNumber = (val) => val !== undefined && !isNaN(Number(val)) ? Number(val) : undefined;
const GET = async (req, res) => {
    try {
        const pool = await (0, db_1.connectDB)();
        const nroOT = toNumber(req.query.nroOT);
        const codTaller = toNumber(req.query.codTaller);
        const nroBus = toNumber(req.query.nroBus);
        const estadoOT = toNumber(req.query.estadoOT);
        const tipoOT = toNumber(req.query.tipoOT);
        const nroManager = toNumber(req.query.nroManager);
        const fechaIngreso = req.query.fechaIngreso
            ? new Date(req.query.fechaIngreso)
            : undefined;
        const fechaSalida = req.query.fechaSalida
            ? new Date(req.query.fechaSalida)
            : undefined;
        const pageIndex = toNumber(req.query.pagina) ?? 0;
        const pageSize = 15; // constante, configurable
        const offset = pageIndex * pageSize;
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
            pagina: offset,
        });
        // respuesta al cliente
        res.json({
            total,
            pageIndex,
            pageSize,
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
