"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFallaController = void 0;
const db_1 = require("../../../helpers/db");
const services_1 = require("../../../services/ordenDeTrabajo/services");
const deleteFallaController = async (req, res) => {
    try {
        const pool = await (0, db_1.connectDB)();
        const input = {
            item: req.body.item ?? 0,
            idRelacionFalla: Number(req.params.idRelacionFalla),
        };
        const result = await (0, services_1.deleteFallaService)(pool, input);
        return res.status(200).json(result);
    }
    catch (error) {
        console.error("Error en deleteFallaController:", error);
        return res.status(500).json({
            success: false,
            message: "Error interno del servidor al eliminar la falla.",
        });
    }
};
exports.deleteFallaController = deleteFallaController;
