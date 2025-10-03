"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllSubSistemasController = exports.getSubSistemasController = exports.getSistemasController = void 0;
const db_1 = require("../../../helpers/db");
const services_1 = require("../../../services/ordenDeTrabajo/services");
const getSistemasController = async (req, res) => {
    try {
        const pool = await (0, db_1.connectDB)();
        const sistemas = await (0, services_1.getSistemas)(pool);
        return res.status(200).json(sistemas);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.getSistemasController = getSistemasController;
const getSubSistemasController = async (req, res) => {
    try {
        const { id_falla_principal } = req.params;
        if (!id_falla_principal) {
            return res
                .status(400)
                .json({ message: "Debe indicar id_falla_principal" });
        }
        const pool = await (0, db_1.connectDB)();
        const subSistemas = await (0, services_1.getSubSistemas)(pool, Number(id_falla_principal));
        return res.status(200).json(subSistemas);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.getSubSistemasController = getSubSistemasController;
const getAllSubSistemasController = async (req, res) => {
    try {
        const pool = await (0, db_1.connectDB)();
        const subSistemas = await (0, services_1.getAllSubSistemas)(pool);
        return res.status(200).json(subSistemas);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.getAllSubSistemasController = getAllSubSistemasController;
