"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UPDATE = exports.GET = void 0;
const db_1 = require("../../../helpers/db");
const services_1 = require("../../../services/ordenDeTrabajo/services");
const GET = async (req, res) => {
    const { idOrden } = req.params;
    if (!idOrden)
        return res.status(400).json({ message: "Falta idOrden" });
    try {
        const pool = await (0, db_1.connectDB)();
        const details = await (0, services_1.getOrderDetailsService)(pool, Number(idOrden));
        if (!details) {
            return res.status(404).json({ message: "Orden no encontrada" });
        }
        return res.status(200).json(details);
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
exports.GET = GET;
const UPDATE = async (req, res) => {
    try {
        const input = req.body;
        const pool = await (0, db_1.connectDB)();
        if (!input.idOrden || !input.idFallaPrincipal) {
            return res.status(400).json({
                success: 0,
                action: "ERROR",
                affected_rows: 0,
                message: "Parámetros obligatorios faltantes: idOrden, idFallaPrincipal",
            });
        }
        const result = await (0, services_1.updateFallaService)(pool, input);
        if (result.success === 1) {
            return res.json(result);
        }
        else {
            return res.status(400).json(result);
        }
    }
    catch (error) {
        console.error("Error en updateFallaController:", error);
        return res.status(500).json({
            success: 0,
            action: "ERROR",
            affected_rows: 0,
            message: "Error en el servidor al actualizar la falla",
        });
    }
};
exports.UPDATE = UPDATE;
