"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DELETE = exports.POST = exports.GET = void 0;
const db_1 = require("../../helpers/db");
const services_1 = require("../../services/ordenDeTrabajo/services");
const toNumber = (val) => val !== undefined && !isNaN(Number(val)) ? Number(val) : undefined;
const GET = async (req, res) => {
    try {
        const pool = await (0, db_1.connectDB)();
        const nroOT = toNumber(req.query.nroOT);
        const codTaller = toNumber(req.query.codTaller);
        const nroBus = toNumber(req.query.nroBus);
        const estadoOT = toNumber(req.query.estadoOT);
        const tipoOT = toNumber(req.query.tipoOT);
        const nroManager = toNumber(req.query.nroManager);
        const fechaIngreso = req.query.fechaIngreso
            ? new Date(req.query.fechaIngreso)
            : undefined;
        const fechaSalida = req.query.fechaSalida
            ? new Date(req.query.fechaSalida)
            : undefined;
        const pageIndex = toNumber(req.query.pagina) ?? 0;
        const pageSize = 15; // constante, configurable
        const offset = pageIndex * pageSize;
        // llamada al service
        const { data, total } = await (0, services_1.getOrdenesTrabajo)({
            pool,
            nroOT,
            codTaller,
            nroBus,
            estadoOT,
            tipoOT,
            fechaIngreso,
            fechaSalida,
            nroManager,
            pagina: offset,
        });
        // respuesta al cliente
        res.json({
            total,
            pageIndex,
            pageSize,
            data,
        });
    }
    catch (error) {
        console.error("Error en getOrdenesTrabajoController:", error);
        res.status(500).json({
            message: "Error al obtener órdenes de trabajo",
            error: error.message,
        });
    }
};
exports.GET = GET;
const POST = async (req, res) => {
    try {
        const input = req.body;
        const pool = await (0, db_1.connectDB)();
        // Validaciones básicas
        if (!input.id_personal_ingreso ||
            !input.id_tipo_orden ||
            !input.codigo_flota ||
            !input.detalle_ingreso ||
            !input.codigo_taller) {
            return res
                .status(400)
                .json({ message: "Faltan datos obligatorios para crear la OT" });
        }
        // Validar fallas solo si no es preventiva
        if (input.id_tipo_orden !== 2 &&
            (!input.fallas || input.fallas.length === 0)) {
            return res
                .status(400)
                .json({ message: "Debe ingresar al menos una falla" });
        }
        const orden = await (0, services_1.createOrdenTrabajo)(pool, input);
        return res
            .status(201)
            .json({ message: "Orden creada con éxito", data: orden });
    }
    catch (error) {
        console.error("Error al crear la OT:", error);
        return res.status(500).json({ message: error.message });
    }
};
exports.POST = POST;
const DELETE = async (req, res) => {
    try {
        const pool = await (0, db_1.connectDB)();
        const idOrden = Number(req.params.id);
        if (isNaN(idOrden)) {
            return res.status(400).json({
                success: false,
                message: "El id_orden_trabajo debe ser un número válido",
            });
        }
        const result = await (0, services_1.softDeleteOrdenTrabajo)(pool, idOrden);
        res.json({
            success: result.respuesta === 1,
            ...result,
        });
    }
    catch (error) {
        console.error("Error en deleteOrdenTrabajo:", error);
        res.status(500).json({
            success: false,
            message: "Error al ejecutar soft delete de la OT",
            error: error.message,
        });
    }
};
exports.DELETE = DELETE;
