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
const getDataFiltrosMant = async (pool, tipo) => {
    const executeFilter = async (item) => {
        const { recordset } = await pool
            .request()
            .input("item", mssql_1.default.Int, item)
            .execute("MANT.dbo.sp_getInfoFiltros");
        return recordset ?? [];
    };
    if (tipo) {
        const map = {
            OTs: 0,
            talleres: 3,
            buses: 1,
            estadosOt: 11,
            tiposOt: 12,
            nrosManager: 13,
            fallaPrincipal: 14,
            fallaSecundaria: 15,
            mecanicos: 16,
            servicios: 17,
        };
        return { [tipo]: await executeFilter(map[tipo]) };
    }
    // si no hay tipo, traer todo (más lento)
    return {
        OTs: await executeFilter(0),
        talleres: await executeFilter(3),
        buses: await executeFilter(1),
        estadosOt: await executeFilter(11),
        tiposOt: await executeFilter(12),
        nrosManager: await executeFilter(13),
        fallaPrincipal: await executeFilter(14),
        fallaSecundaria: await executeFilter(15),
        mecanicos: await executeFilter(16),
        servicios: await executeFilter(17),
    };
};
exports.getDataFiltrosMant = getDataFiltrosMant;
