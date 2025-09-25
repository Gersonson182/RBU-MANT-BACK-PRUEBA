"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDataFiltrosMant = exports.getOrdenesTrabajo = void 0;
const mssql_1 = __importDefault(require("mssql"));
const getOrdenesTrabajo = async ({ pool, nroOT, codTaller, nroBus, estadoOT, tipoOT, fechaIngreso, fechaSalida, nroManager, pagina = 0, }) => {
    const { recordset } = await pool
        .request()
        .input("item", mssql_1.default.TinyInt, 0)
        .input("nroOT", mssql_1.default.Int, nroOT ?? null)
        .input("codTaller", mssql_1.default.Int, codTaller ?? null)
        .input("nroBus", mssql_1.default.Int, nroBus ?? null)
        .input("estadoOT", mssql_1.default.Int, estadoOT ?? null)
        .input("tipoOT", mssql_1.default.Int, tipoOT ?? null)
        .input("fechaIngreso", mssql_1.default.Date, fechaIngreso ?? null)
        .input("fechaSalida", mssql_1.default.Date, fechaSalida ?? null)
        .input("nroManager", mssql_1.default.Int, nroManager ?? null)
        .input("pagina", mssql_1.default.Int, pagina)
        .execute("MANT.dbo.sp_getOrdersNew");
    return {
        data: recordset ?? [],
        total: recordset?.[0]?.total_filas_afectadas ?? 0,
    };
};
exports.getOrdenesTrabajo = getOrdenesTrabajo;
const getDataFiltrosMant = async (pool) => {
    // Función helper genérica para no repetir código
    const executeFilter = async (item) => {
        const { recordset } = await pool
            .request()
            .input("item", mssql_1.default.Int, item)
            .execute("MANT.dbo.sp_getInfoFiltros");
        return recordset ?? [];
    };
    return {
        OTs: await executeFilter(0), // Ordenes de trabajo
        talleres: await executeFilter(3), // Talleres
        buses: await executeFilter(1), // Buses (flota)
        estadosOt: await executeFilter(11), // Estados de OT
        tiposOt: await executeFilter(12), // Tipos de OT
        nrosManager: await executeFilter(13), // Managers
        fallaPrincipal: await executeFilter(14), // Falla principal
        fallaSecundaria: await executeFilter(15), // Falla secundaria
        mecanicos: await executeFilter(16), // Mecánicos
        servicios: await executeFilter(17), // Servicios
    };
};
exports.getDataFiltrosMant = getDataFiltrosMant;
