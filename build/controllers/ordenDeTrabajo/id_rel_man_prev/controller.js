"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DELETE = void 0;
const db_1 = require("../../../helpers/db");
const services_1 = require("../../../services/ordenDeTrabajo/services");
const DELETE = async (req, res) => {
    try {
        const { id_rel_man_prev } = req.params;
        if (!id_rel_man_prev) {
            return res.status(400).json({
                success: 0,
                message: "Debe proporcionar un id_rel_man_prev válido en la URL.",
            });
        }
        const pool = await (0, db_1.connectDB)();
        const result = await (0, services_1.deleteMantencionPreventivaService)(pool, {
            id_rel_man_prev: Number(id_rel_man_prev),
        });
        return res.json({
            success: result.success ? 1 : 0,
            action: result.success ? "DELETE" : "ERROR",
            message: result.message,
        });
    }
    catch (error) {
        console.error("Error en DELETE mantención preventiva:", error);
        return res.status(500).json({
            success: 0,
            message: "Error en el servidor al eliminar la mantención preventiva.",
        });
    }
};
exports.DELETE = DELETE;
