"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = void 0;
const db_1 = require("../../../../helpers/db");
const services_1 = require("../../../../services/ordenDeTrabajo/services");
const GET = async (req, res) => {
    try {
        const { codigo_flota, id_orden_trabajo } = req.query;
        if (!codigo_flota || !id_orden_trabajo) {
            return res.status(400).json({
                success: false,
                message: "Parámetros obligatorios faltantes: codigo_flota o id_orden_trabajo",
                data: [],
            });
        }
        const pool = await (0, db_1.connectDB)();
        const result = await (0, services_1.getSiglasPreventivasByFlotaService)(pool, {
            codigo_flota: Number(codigo_flota),
            id_orden_trabajo: Number(id_orden_trabajo),
        });
        return res.json(result);
    }
    catch (error) {
        console.error("Error en GET_SIGLAS_PREVENTIVAS_BY_FLOTA:", error);
        return res.status(500).json({
            success: false,
            message: "Error interno del servidor",
            data: [],
        });
    }
};
exports.GET = GET;
