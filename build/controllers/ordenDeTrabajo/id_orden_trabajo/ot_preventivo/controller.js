"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CREATE = void 0;
const services_1 = require("../../../../services/ordenDeTrabajo/services");
const db_1 = require("../../../../helpers/db");
const CREATE = async (req, res) => {
    try {
        const input = req.body;
        const pool = await (0, db_1.connectDB)();
        //  Validaciones mínimas
        if (!input.id_orden_trabajo ||
            !input.id_mantencion_preventiva ||
            !input.id_personal_mantencion_preventiva ||
            !input.personal_reporto ||
            !input.id_perfil_personal_mantencion_preventiva ||
            !input.ppu ||
            !input.siglas_mantenimiento) {
            return res.status(400).json({
                success: 0,
                action: "ERROR",
                affected_rows: 0,
                message: "Parámetros obligatorios faltantes para registrar mantención preventiva.",
            });
        }
        //  Ejecutar el servicio
        const result = await (0, services_1.createMantencionPreventivaService)(pool, input);
        if (result.success) {
            return res.json({
                success: 1,
                action: "INSERT",
                affected_rows: 1,
                message: result.message,
            });
        }
        else {
            return res.status(400).json({
                success: 0,
                action: "ERROR",
                affected_rows: 0,
                message: result.message,
            });
        }
    }
    catch (error) {
        console.error("Error en createMantencionPreventivaController:", error);
        return res.status(500).json({
            success: 0,
            action: "ERROR",
            affected_rows: 0,
            message: "Error interno del servidor al registrar la mantención preventiva.",
        });
    }
};
exports.CREATE = CREATE;
