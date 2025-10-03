"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = void 0;
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
