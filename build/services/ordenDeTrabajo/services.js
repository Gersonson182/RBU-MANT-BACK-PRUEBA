"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderDetailsService = exports.softDeleteOrdenTrabajo = exports.createOrdenTrabajo = exports.getAllSubSistemas = exports.getSubSistemas = exports.getSistemas = exports.getDataFiltrosMant = exports.getOrdenesTrabajo = void 0;
const mssql_1 = __importDefault(require("mssql"));
// TABLA PRINCIPAL Y SUS FILTROS (TODOS LOS FILTROS)
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
// FILTROS DE TABLAS DE INFORMACIÓN
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
        talleres: await executeFilter(3), // Esto se utilizara tambien al crear la OT
        buses: await executeFilter(1), // Esto se utilizara tambien al crear la OT
        estadosOt: await executeFilter(11),
        tiposOt: await executeFilter(12), // Esto se utilizara tambien al crear la OT
        nrosManager: await executeFilter(13),
        fallaPrincipal: await executeFilter(14),
        fallaSecundaria: await executeFilter(15),
        mecanicos: await executeFilter(16),
        servicios: await executeFilter(17),
    };
};
exports.getDataFiltrosMant = getDataFiltrosMant;
/// SISTEMAS Y SUBSISTEMAS DE FALLAS SE UTILIZA AL AÑADIR UNA OT
const getSistemas = async (pool) => {
    const { recordset } = await pool
        .request()
        .input("item", mssql_1.default.Int, 0)
        .execute("MANT.dbo.sp_getSistemasSubSistemas");
    return recordset ?? [];
};
exports.getSistemas = getSistemas;
const getSubSistemas = async (pool, idFallaPrincipal) => {
    const { recordset } = await pool
        .request()
        .input("item", mssql_1.default.Int, 1)
        .input("id_falla_principal", mssql_1.default.BigInt, idFallaPrincipal)
        .execute("MANT.dbo.sp_getSistemasSubSistemas");
    return recordset ?? [];
};
exports.getSubSistemas = getSubSistemas;
const getAllSubSistemas = async (pool) => {
    const { recordset } = await pool
        .request()
        .input("item", mssql_1.default.Int, 2)
        .execute("MANT.dbo.sp_getSistemasSubSistemas");
    return recordset ?? [];
};
exports.getAllSubSistemas = getAllSubSistemas;
// Crear una nueva OT y sus fallas
const createOrdenTrabajo = async (pool, input) => {
    // 1. Insertar OT principal
    const { recordset } = await pool
        .request()
        .input("id_personal_ingreso", mssql_1.default.BigInt, input.id_personal_ingreso)
        .input("id_tipo_orden", mssql_1.default.TinyInt, input.id_tipo_orden)
        .input("codigo_flota", mssql_1.default.SmallInt, input.codigo_flota)
        .input("detalle_ingreso", mssql_1.default.VarChar(500), input.detalle_ingreso)
        .input("fecha_programada", mssql_1.default.DateTime2, input.fecha_programada ?? null)
        .input("taller", mssql_1.default.Int, input.codigo_taller)
        .execute("MANT.dbo.sp_insNewOrder1");
    const orden = recordset?.[0];
    const idOrden = orden?.idSolicitudIngresada;
    if (!idOrden) {
        throw new Error("No se pudo obtener el ID de la nueva orden");
    }
    // 2. Insertar fallas relacionadas
    try {
        for (const falla of input.fallas) {
            await pool
                .request()
                .input("id_orden_trabajo", mssql_1.default.BigInt, idOrden)
                .input("id_falla_principal", mssql_1.default.BigInt, falla.id_falla_principal)
                .input("id_falla_secundaria", mssql_1.default.BigInt, falla.id_falla_secundaria ?? null)
                .input("id_personal_falla_principal", mssql_1.default.BigInt, falla.id_personal_falla_principal ?? null)
                .input("id_personal_falla_secundaria", mssql_1.default.BigInt, falla.id_personal_falla_secundaria ?? null)
                .input("id_perfil_principal", mssql_1.default.BigInt, falla.id_perfil_principal ?? null)
                .input("id_perfil_secundaria", mssql_1.default.BigInt, falla.id_perfil_secundaria ?? null)
                .input("servicio", mssql_1.default.VarChar(40), input.servicio ?? null)
                .execute("MANT.dbo.sp_insNewOrder2");
        }
    }
    catch (error) {
        // rollback si falla
        await pool
            .request()
            .input("id_orden_trabajo", mssql_1.default.BigInt, idOrden)
            .execute("MANT.dbo.sp_delRollbackNewOrder");
        throw error;
    }
    return orden;
};
exports.createOrdenTrabajo = createOrdenTrabajo;
// Eliminar una OT MODO ADMINISTRADOR
/**
 * Ejecuta el soft delete de una orden de trabajo (registro_activo = 0 en cascada).
 */
const softDeleteOrdenTrabajo = async (pool, idOrdenTrabajo) => {
    const { recordset } = await pool
        .request()
        .input("id_orden_trabajo", mssql_1.default.BigInt, idOrdenTrabajo)
        .execute("MANT.dbo.sp_softDeleteOrder");
    // El SP devuelve un recordset con respuesta y mensaje
    return recordset?.[0] ?? { respuesta: -1, mensaje: "Error inesperado" };
};
exports.softDeleteOrdenTrabajo = softDeleteOrdenTrabajo;
// GET DETALLES DE OT CORRECTIVA Y OT PREVENTIVA SEGUN ID_ORDEN_TRABAJO //
const getOrderDetailsService = async (pool, idOrden) => {
    // 1. Datos base
    const { recordset: basicData } = await pool
        .request()
        .input("item", mssql_1.default.Int, 0)
        .input("id_orden", mssql_1.default.BigInt, idOrden)
        .input("id_orden_trabajo", mssql_1.default.BigInt, idOrden) // ⚡ siempre pasar ambos
        .execute("MANT.dbo.sp_getOrderDetails");
    if (!basicData || basicData.length === 0)
        return null;
    const basic = basicData[0];
    // Arrays unificados
    const sistemas = [];
    const insumos = [];
    const personal = [];
    // --- FALLAS (Correctivas o Preventivas detectadas en item=1) ---
    const { recordset: fallas } = await pool
        .request()
        .input("item", mssql_1.default.Int, 1)
        .input("id_orden", mssql_1.default.BigInt, idOrden)
        .execute("MANT.dbo.sp_getOrderDetails");
    fallas.forEach((f) => sistemas.push({
        tipo: basic.tipoOrden, // "Correctiva" o "Preventiva"
        idRelacionFalla: f.idRelacionFalla,
        detalleFallaPrincipal: f.detalleFallaPrincipal,
        detalleFallaSecundaria: f.detalleFallaSecundaria,
        mecanicoAsignado: f.tecnicoVidrio,
        idMecanicoAsignado: f.idTecnicoVidrio,
    }));
    // --- PERSONAL (solo si existen responsables asignados) ---
    const { recordset: personalData } = await pool
        .request()
        .input("item", mssql_1.default.Int, 2)
        .input("id_orden", mssql_1.default.BigInt, idOrden)
        .execute("MANT.dbo.sp_getOrderDetails");
    personalData.forEach((p) => personal.push({
        idPersonal: p.idPersonal,
        nombrePersonal: p.nombrePersonal,
        cargoPersonal: p.cargoPersonal,
        descripcionFalla: p.descripcionFalla,
        estadoFalla: p.estadoFalla,
        tecnicoVidrio: p.tecnicoVidrio,
        idTecnicoVidrio: p.idTecnicoVidrio,
    }));
    // --- INSUMOS CORRECTIVOS ---
    const { recordset: insumosCorrectivos } = await pool
        .request()
        .input("item", mssql_1.default.Int, 3)
        .input("id_orden", mssql_1.default.BigInt, idOrden)
        .execute("MANT.dbo.sp_getOrderDetails");
    insumosCorrectivos.forEach((i) => insumos.push({
        tipo: "Correctiva",
        idInsumo: i.idInsumo,
        codigoInsumo: i.codigoInsumo,
        descripcionInsumo: i.descripcionInsumo,
        cantidad: i.cantidad,
        estado: i.estado,
        estadoManager: i.estadoManager,
        idSiglas: i.idSiglas,
    }));
    // --- INSUMOS PREVENTIVOS ---
    const { recordset: insumosPreventivos } = await pool
        .request()
        .input("item", mssql_1.default.Int, 5)
        .input("id_orden", mssql_1.default.BigInt, idOrden)
        .input("id_orden_trabajo", mssql_1.default.BigInt, idOrden)
        .execute("MANT.dbo.sp_getOrderDetails");
    insumosPreventivos.forEach((i) => insumos.push({
        tipo: "Preventiva",
        idInsumo: i.idInsumo,
        codigoInsumo: i.codigoInsumo,
        descripcionInsumo: i.descripcionInsumo,
        cantidad: i.cantidad,
        estado: i.estadoAprobacion,
        estadoManager: i.estadoManager,
        idSiglas: i.idSigla,
    }));
    // --- SISTEMAS PREVENTIVOS ---
    const { recordset: sistemasPreventivos } = await pool
        .request()
        .input("item", mssql_1.default.Int, 6)
        .input("id_orden", mssql_1.default.BigInt, idOrden)
        .input("id_orden_trabajo", mssql_1.default.BigInt, idOrden)
        .execute("MANT.dbo.sp_getOrderDetails");
    sistemasPreventivos.forEach((s) => sistemas.push({
        tipo: "Preventiva",
        idSistemaPreventiva: s.idSistemaPreventiva,
        detalleFallaPrincipal: s.detalleFallaPrincipal,
        detalleSistemaPreventiva: s.detalleSistemaPreventiva,
        mecanicoAsignado: s.mecanicoAsignado,
    }));
    // 3. Respuesta unificada
    return {
        basic,
        sistemas,
        insumos,
        personal,
    };
};
exports.getOrderDetailsService = getOrderDetailsService;
