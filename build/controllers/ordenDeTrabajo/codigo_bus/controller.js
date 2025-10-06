"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLatestMaintenanceController = void 0;
const db_1 = require("../../../helpers/db");
const services_1 = require("../../../services/ordenDeTrabajo/services");
const getLatestMaintenanceController = async (req, res) => {
    try {
        const { numeroBus, placaPatente } = req.query;
        if (!numeroBus && !placaPatente) {
            return res.status(400).json({
                message: "Debe proporcionar 'numeroBus' o 'placaPatente' como parámetro.",
            });
        }
        const pool = await (0, db_1.connectDB)();
        const data = await (0, services_1.getLatestMaintenance)(pool, numeroBus ? Number(numeroBus) : undefined, placaPatente ? String(placaPatente) : undefined);
        if (!data || data.length === 0) {
            return res.status(404).json({
                message: "No se encontraron registros de mantención preventiva.",
            });
        }
        return res.status(200).json({
            message: "Consulta exitosa",
            data,
        });
    }
    catch (error) {
        console.error("Error en getLatestMaintenanceController:", error);
        return res.status(500).json({
            message: "Error al obtener la información de mantención preventiva.",
            error: error.message,
        });
    }
};
exports.getLatestMaintenanceController = getLatestMaintenanceController;
