"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSiglasPreventivasController = void 0;
const db_1 = require("../../../helpers/db");
const services_js_1 = require("../../../services/ordenDeTrabajo/services.js");
/**
 * Controlador para obtener siglas preventivas por código de flota
 * Ejemplo de uso:
 * GET /api/ordenDeTrabajo/siglas-preventivas?codigoFlota=3574
 */
const getSiglasPreventivasController = async (req, res) => {
    try {
        const codigoFlota = Number(req.query.codigoFlota);
        if (!codigoFlota) {
            return res
                .status(400)
                .json({ message: "Debe especificar el parámetro codigoFlota" });
        }
        const pool = await (0, db_1.connectDB)();
        const data = await (0, services_js_1.getSiglasPreventivas)(pool, codigoFlota);
        if (!data.length) {
            return res.status(404).json({
                message: "No se encontraron siglas preventivas para el código de flota indicado",
                data: [],
            });
        }
        return res.status(200).json({
            message: "Consulta exitosa",
            data,
        });
    }
    catch (error) {
        console.error("Error al obtener siglas preventivas:", error);
        return res.status(500).json({ message: error.message });
    }
};
exports.getSiglasPreventivasController = getSiglasPreventivasController;
