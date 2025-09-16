"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = void 0;
const db_1 = require("../../../../helpers/db");
const auth_1 = require("../../../../services/auth");
const GET = async (req, res) => {
    try {
        const { idUsuario } = req.params;
        if (!idUsuario)
            return res.status(400).json({ message: "Usuario no especificado" });
        const pool = await (0, db_1.connectDB)();
        const permissions = await (0, auth_1.getPermissionsByProfile)({
            pool,
            values: { idUsuario: parseInt(idUsuario) },
        });
        if (!permissions)
            return res.status(404).json({ message: "No se encontraron permisos" });
        return res.status(200).json(permissions);
    }
    catch {
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.GET = GET;
