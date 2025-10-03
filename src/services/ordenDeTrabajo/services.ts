import sql, { ConnectionPool } from "mssql";
import {
  OrdenDeTrabajo,
  GetOrdenesTrabajoInput,
  DataFiltrosMant,
  SistemaFiltro,
  SubSistemaFiltro,
  CreateOrdenTrabajoInput,
  OrdenTrabajoCreada,
  SoftDeleteResponse,
  OrdenTrabajoDetailsNormalizado,
  OrdenTrabajoSistema,
  OrdenTrabajoInsumoNormalizado,
  OrdenTrabajoPersonalNormalizado,
} from "../../types/ordenDeTrabajo/ordenDeTrabajo";

// TABLA PRINCIPAL Y SUS FILTROS (TODOS LOS FILTROS)
export const getOrdenesTrabajo = async ({
  pool,
  nroOT,
  codTaller,
  nroBus,
  estadoOT,
  tipoOT,
  fechaIngreso,
  fechaSalida,
  nroManager,
  pagina = 0,
}: GetOrdenesTrabajoInput): Promise<{
  data: OrdenDeTrabajo[];
  total: number;
}> => {
  const { recordset } = await pool
    .request()
    .input("item", sql.TinyInt, 0)
    .input("nroOT", sql.Int, nroOT ?? null)
    .input("codTaller", sql.Int, codTaller ?? null)
    .input("nroBus", sql.Int, nroBus ?? null)
    .input("estadoOT", sql.Int, estadoOT ?? null)
    .input("tipoOT", sql.Int, tipoOT ?? null)
    .input("fechaIngreso", sql.Date, fechaIngreso ?? null)
    .input("fechaSalida", sql.Date, fechaSalida ?? null)
    .input("nroManager", sql.Int, nroManager ?? null)
    .input("pagina", sql.Int, pagina)
    .execute("MANT.dbo.sp_getOrdersNew");

  return {
    data: recordset ?? [],
    total: recordset?.[0]?.total_filas_afectadas ?? 0,
  };
};

// FILTROS DE TABLAS DE INFORMACIÓN

export const getDataFiltrosMant = async (
  pool: ConnectionPool,
  tipo?: keyof DataFiltrosMant
): Promise<Partial<DataFiltrosMant>> => {
  const executeFilter = async <T>(item: number): Promise<T[]> => {
    const { recordset } = await pool
      .request()
      .input("item", sql.Int, item)
      .execute("MANT.dbo.sp_getInfoFiltros");

    return recordset ?? [];
  };

  if (tipo) {
    const map: Record<keyof DataFiltrosMant, number> = {
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

/// SISTEMAS Y SUBSISTEMAS DE FALLAS SE UTILIZA AL AÑADIR UNA OT

export const getSistemas = async (
  pool: ConnectionPool
): Promise<SistemaFiltro[]> => {
  const { recordset } = await pool
    .request()
    .input("item", sql.Int, 0)
    .execute("MANT.dbo.sp_getSistemasSubSistemas");

  return recordset ?? [];
};

export const getSubSistemas = async (
  pool: ConnectionPool,
  idFallaPrincipal: number
): Promise<SubSistemaFiltro[]> => {
  const { recordset } = await pool
    .request()
    .input("item", sql.Int, 1)
    .input("id_falla_principal", sql.BigInt, idFallaPrincipal)
    .execute("MANT.dbo.sp_getSistemasSubSistemas");

  return recordset ?? [];
};

export const getAllSubSistemas = async (
  pool: ConnectionPool
): Promise<SubSistemaFiltro[]> => {
  const { recordset } = await pool
    .request()
    .input("item", sql.Int, 2)
    .execute("MANT.dbo.sp_getSistemasSubSistemas");

  return recordset ?? [];
};

// Crear una nueva OT y sus fallas
export const createOrdenTrabajo = async (
  pool: ConnectionPool,
  input: CreateOrdenTrabajoInput
): Promise<OrdenTrabajoCreada> => {
  // 1. Insertar OT principal
  const { recordset } = await pool
    .request()
    .input("id_personal_ingreso", sql.BigInt, input.id_personal_ingreso)
    .input("id_tipo_orden", sql.TinyInt, input.id_tipo_orden)
    .input("codigo_flota", sql.SmallInt, input.codigo_flota)
    .input("detalle_ingreso", sql.VarChar(500), input.detalle_ingreso)
    .input("fecha_programada", sql.DateTime2, input.fecha_programada ?? null)
    .input("taller", sql.Int, input.codigo_taller)
    .execute("MANT.dbo.sp_insNewOrder1");

  const orden = recordset?.[0] as OrdenTrabajoCreada;
  const idOrden = orden?.idSolicitudIngresada;

  if (!idOrden) {
    throw new Error("No se pudo obtener el ID de la nueva orden");
  }

  // 2. Insertar fallas relacionadas
  try {
    for (const falla of input.fallas) {
      await pool
        .request()
        .input("id_orden_trabajo", sql.BigInt, idOrden)
        .input("id_falla_principal", sql.BigInt, falla.id_falla_principal)
        .input(
          "id_falla_secundaria",
          sql.BigInt,
          falla.id_falla_secundaria ?? null
        )
        .input(
          "id_personal_falla_principal",
          sql.BigInt,
          falla.id_personal_falla_principal ?? null
        )
        .input(
          "id_personal_falla_secundaria",
          sql.BigInt,
          falla.id_personal_falla_secundaria ?? null
        )
        .input(
          "id_perfil_principal",
          sql.BigInt,
          falla.id_perfil_principal ?? null
        )
        .input(
          "id_perfil_secundaria",
          sql.BigInt,
          falla.id_perfil_secundaria ?? null
        )
        .input("servicio", sql.VarChar(40), input.servicio ?? null)
        .execute("MANT.dbo.sp_insNewOrder2");
    }
  } catch (error) {
    // rollback si falla
    await pool
      .request()
      .input("id_orden_trabajo", sql.BigInt, idOrden)
      .execute("MANT.dbo.sp_delRollbackNewOrder");
    throw error;
  }

  return orden;
};

// Eliminar una OT MODO ADMINISTRADOR

/**
 * Ejecuta el soft delete de una orden de trabajo (registro_activo = 0 en cascada).
 */
export const softDeleteOrdenTrabajo = async (
  pool: ConnectionPool,
  idOrdenTrabajo: number
): Promise<SoftDeleteResponse> => {
  const { recordset } = await pool
    .request()
    .input("id_orden_trabajo", sql.BigInt, idOrdenTrabajo)
    .execute("MANT.dbo.sp_softDeleteOrder");

  // El SP devuelve un recordset con respuesta y mensaje
  return recordset?.[0] ?? { respuesta: -1, mensaje: "Error inesperado" };
};

// GET DETALLES DE OT CORRECTIVA Y OT PREVENTIVA SEGUN ID_ORDEN_TRABAJO //
export const getOrderDetailsService = async (
  pool: ConnectionPool,
  idOrden: number
): Promise<OrdenTrabajoDetailsNormalizado | null> => {
  // 1. Datos base
  const { recordset: basicData } = await pool
    .request()
    .input("item", sql.Int, 0)
    .input("id_orden", sql.BigInt, idOrden)
    .input("id_orden_trabajo", sql.BigInt, idOrden) // ⚡ siempre pasar ambos
    .execute("MANT.dbo.sp_getOrderDetails");

  if (!basicData || basicData.length === 0) return null;
  const basic = basicData[0];

  // Arrays unificados
  const sistemas: OrdenTrabajoSistema[] = [];
  const insumos: OrdenTrabajoInsumoNormalizado[] = [];
  const personal: OrdenTrabajoPersonalNormalizado[] = [];

  // --- FALLAS (Correctivas o Preventivas detectadas en item=1) ---
  const { recordset: fallas } = await pool
    .request()
    .input("item", sql.Int, 1)
    .input("id_orden", sql.BigInt, idOrden)
    .execute("MANT.dbo.sp_getOrderDetails");

  fallas.forEach((f: any) =>
    sistemas.push({
      tipo: basic.tipoOrden, // "Correctiva" o "Preventiva"
      idRelacionFalla: f.idRelacionFalla,
      detalleFallaPrincipal: f.detalleFallaPrincipal,
      detalleFallaSecundaria: f.detalleFallaSecundaria,
      mecanicoAsignado: f.tecnicoVidrio,
      idMecanicoAsignado: f.idTecnicoVidrio,
    })
  );

  // --- PERSONAL (solo si existen responsables asignados) ---
  const { recordset: personalData } = await pool
    .request()
    .input("item", sql.Int, 2)
    .input("id_orden", sql.BigInt, idOrden)
    .execute("MANT.dbo.sp_getOrderDetails");

  personalData.forEach((p: any) =>
    personal.push({
      idPersonal: p.idPersonal,
      nombrePersonal: p.nombrePersonal,
      cargoPersonal: p.cargoPersonal,
      descripcionFalla: p.descripcionFalla,
      estadoFalla: p.estadoFalla,
      tecnicoVidrio: p.tecnicoVidrio,
      idTecnicoVidrio: p.idTecnicoVidrio,
    })
  );

  // --- INSUMOS CORRECTIVOS ---
  const { recordset: insumosCorrectivos } = await pool
    .request()
    .input("item", sql.Int, 3)
    .input("id_orden", sql.BigInt, idOrden)
    .execute("MANT.dbo.sp_getOrderDetails");

  insumosCorrectivos.forEach((i: any) =>
    insumos.push({
      tipo: "Correctiva",
      idInsumo: i.idInsumo,
      codigoInsumo: i.codigoInsumo,
      descripcionInsumo: i.descripcionInsumo,
      cantidad: i.cantidad,
      estado: i.estado,
      estadoManager: i.estadoManager,
      idSiglas: i.idSiglas,
    })
  );

  // --- INSUMOS PREVENTIVOS ---
  const { recordset: insumosPreventivos } = await pool
    .request()
    .input("item", sql.Int, 5)
    .input("id_orden", sql.BigInt, idOrden)
    .input("id_orden_trabajo", sql.BigInt, idOrden)
    .execute("MANT.dbo.sp_getOrderDetails");

  insumosPreventivos.forEach((i: any) =>
    insumos.push({
      tipo: "Preventiva",
      idInsumo: i.idInsumo,
      codigoInsumo: i.codigoInsumo,
      descripcionInsumo: i.descripcionInsumo,
      cantidad: i.cantidad,
      estado: i.estadoAprobacion,
      estadoManager: i.estadoManager,
      idSiglas: i.idSigla,
    })
  );

  // --- SISTEMAS PREVENTIVOS ---
  const { recordset: sistemasPreventivos } = await pool
    .request()
    .input("item", sql.Int, 6)
    .input("id_orden", sql.BigInt, idOrden)
    .input("id_orden_trabajo", sql.BigInt, idOrden)
    .execute("MANT.dbo.sp_getOrderDetails");

  sistemasPreventivos.forEach((s: any) =>
    sistemas.push({
      tipo: "Preventiva",
      idSistemaPreventiva: s.idSistemaPreventiva,
      detalleFallaPrincipal: s.detalleFallaPrincipal,
      detalleSistemaPreventiva: s.detalleSistemaPreventiva,
      mecanicoAsignado: s.mecanicoAsignado,
    })
  );

  // 3. Respuesta unificada
  return {
    basic,
    sistemas,
    insumos,
    personal,
  };
};
