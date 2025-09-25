"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDataFiltrosMantController = void 0;
const db_1 = require("../../../helpers/db");
const services_1 = require("../../../services/ordenDeTrabajo/services");
const getDataFiltrosMantController = async (req, res) => {
    try {
        const pool = await (0, db_1.connectDB)();
        const tipo = req.query.tipo;
        const data = await (0, services_1.getDataFiltrosMant)(pool);
        if (tipo) {
            if (data[tipo]) {
                // devolver solo el filtro pedido
                return res.status(200).json(data[tipo]);
            }
            else {
                return res
                    .status(400)
                    .json({ message: `El filtro '${tipo}' no existe` });
            }
        }
        // si no viene query param devuelve todo
        return res.status(200).json(data);
    }
    catch (error) {
        console.error("Error en getDataFiltrosMantController:", error);
        res.status(500).json({
            message: "Error al obtener filtros de órdenes de trabajo",
            error: error.message,
        });
    }
};
exports.getDataFiltrosMantController = getDataFiltrosMantController;
