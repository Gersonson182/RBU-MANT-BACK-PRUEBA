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
  UpdateFallaInput,
  UpdateFallaResponse,
  DeleteFallaInput,
  DeleteFallaResponse,
  MantencionPreventiva,
  SiglaPreventiva,
  MantencionPreventivaCrear,
  MantencionPreventivaResponse,
  SiglaPreventivaRegistro,
  GetSiglasPreventivasByFlotaInput,
  GetSiglasPreventivasByFlotaResponse,
  DeleteMantencionPreventivaInput,
  DeleteMantencionPreventivaResponse,
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
  console.log("=== Creando nueva Orden de Trabajo ===");
  console.log("Payload recibido desde frontend:");
  console.dir(input, { depth: null });

  let orden: OrdenTrabajoCreada | null = null;
  let idOrden: number | null = null;

  try {
    // 1) Insertar OT principal
    console.log("Ejecutando sp_insNewOrder1 con parámetros:");
    console.log({
      id_personal_ingreso: input.id_personal_ingreso,
      id_tipo_orden: input.id_tipo_orden,
      codigo_flota: input.codigo_flota,
      detalle_ingreso: input.detalle_ingreso,
      fecha_programada: input.fecha_programada,
      taller: input.codigo_taller,
    });

    const { recordset } = await pool
      .request()
      .input("id_personal_ingreso", sql.BigInt, input.id_personal_ingreso)
      .input("id_tipo_orden", sql.TinyInt, input.id_tipo_orden)
      .input("codigo_flota", sql.SmallInt, input.codigo_flota)
      .input("detalle_ingreso", sql.VarChar(500), input.detalle_ingreso)
      .input("fecha_programada", sql.DateTime2, input.fecha_programada ?? null)
      .input("taller", sql.Int, input.codigo_taller)
      .execute("MANT.dbo.sp_insNewOrder1");

    orden = recordset?.[0] as OrdenTrabajoCreada;
    idOrden = orden?.idSolicitudIngresada ?? null;

    if (!idOrden) {
      console.error(
        "No se pudo obtener ID de orden (recordset vacío):",
        recordset
      );
      throw new Error(
        "sp_insNewOrder1 no devolvió un idSolicitudIngresada válido"
      );
    }

    console.log(` OT creada correctamente. ID: ${idOrden}`);
  } catch (error) {
    console.error(" Error ejecutando sp_insNewOrder1:", error);
    throw new Error(`Error al insertar orden principal: ${error}`);
  }

  // 2) Si es preventiva, terminamos aquí
  if (input.id_tipo_orden === 2) {
    console.log("OT Preventiva detectada. No se insertarán fallas.");
    return orden!;
  }

  // 3) Insertar fallas relacionadas (solo si hay)
  if (Array.isArray(input.fallas) && input.fallas.length > 0) {
    try {
      for (const falla of input.fallas) {
        console.log("Insertando falla:", falla);

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
      console.log("Fallas insertadas correctamente.");
    } catch (error) {
      console.error(" Error al insertar fallas. Ejecutando rollback:", error);
      await pool
        .request()
        .input("id_orden_trabajo", sql.BigInt, idOrden)
        .execute("MANT.dbo.sp_delRollbackNewOrder");
      throw new Error(
        `Error al insertar fallas: ${
          error instanceof Error ? error.message : error
        }`
      );
    }
  } else {
    console.log("No hay fallas que insertar.");
  }

  console.log("=== Orden creada correctamente ===");
  return orden!;
};

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

export const updateFallaService = async (
  pool: ConnectionPool,
  input: UpdateFallaInput
): Promise<UpdateFallaResponse> => {
  const { recordset } = await pool
    .request()
    .input("item", sql.Int, 1)
    .input("id_orden_trabajo", sql.BigInt, input.idOrden)
    .input("id_relacion_falla", sql.BigInt, input.idRelacionFalla ?? null)
    .input(
      "id_personal_principal",
      sql.BigInt,
      input.idPersonalPrincipal ?? null
    )
    .input(
      "id_personal_secundaria",
      sql.BigInt,
      input.idPersonalSecundaria ?? null
    )
    .input("id_falla_principal", sql.BigInt, input.idFallaPrincipal)
    .input("id_falla_secundaria", sql.BigInt, input.idFallaSecundaria ?? null)
    .input("id_perfil_principal", sql.BigInt, input.idPerfilPrincipal ?? null)
    .input("id_perfil_secundaria", sql.BigInt, input.idPerfilSecundaria ?? null)
    .execute<UpdateFallaResponse>("MANT.dbo.sp_updOrderFailuresNew");

  return recordset[0];
};

// Eliminar una falla

export const deleteFallaService = async (
  pool: ConnectionPool,
  input: DeleteFallaInput
): Promise<DeleteFallaResponse> => {
  const { recordset } = await pool
    .request()
    .input("item", sql.Int, input.item ?? 0)
    .input("idRelacionFalla", sql.BigInt, input.idRelacionFalla)
    .execute<DeleteFallaResponse>("MANT.dbo.sp_delOrderFailuresNew");

  return recordset[0];
};

// GET DETALLES DE OT PREVENTIVO SEGUN NUMERO DE BUS //

export const getLatestMaintenance = async (
  pool: ConnectionPool,
  numeroBus?: number,
  placaPatente?: string
): Promise<MantencionPreventiva[]> => {
  const result = await pool
    .request()
    .input("numeroBus", sql.Int, numeroBus ?? null)
    .input("placaPatente", sql.VarChar(20), placaPatente ?? null)
    .execute("MANT.dbo.sp_getLatestMaintenance_GML_NEW");

  return result.recordset as MantencionPreventiva[];
};

export const getSiglasPreventivas = async (
  pool: ConnectionPool,
  codigoFlota: number
): Promise<SiglaPreventiva[]> => {
  const { recordset } = await pool
    .request()
    .input("codigo_flota", sql.BigInt, codigoFlota)
    .execute("MANT.dbo.sp_getManPrev");

  return recordset ?? [];
};

// Crear una nueva OT preventiva enlazada a una falla

export const createMantencionPreventivaService = async (
  pool: ConnectionPool,
  data: MantencionPreventivaCrear
): Promise<MantencionPreventivaResponse> => {
  const {
    id_orden_trabajo,
    id_mantencion_preventiva,
    id_personal_mantencion_preventiva,
    personal_reporto,
    id_perfil_personal_mantencion_preventiva,
    id_estado_mantencion,
    ppu,
    siglas_mantenimiento,
  } = data;

  try {
    await pool
      .request()
      .input("id_orden_trabajo", sql.BigInt, id_orden_trabajo)
      .input("id_mantencion_preventiva", sql.Int, id_mantencion_preventiva)
      .input(
        "id_personal_mantencion_preventiva",
        sql.BigInt,
        id_personal_mantencion_preventiva
      )
      .input("personal_reporto", sql.VarChar(200), personal_reporto)
      .input(
        "id_perfil_personal_mantencion_preventiva",
        sql.SmallInt,
        id_perfil_personal_mantencion_preventiva
      )
      .input("id_estado_mantencion", sql.SmallInt, id_estado_mantencion)
      .input("ppu", sql.VarChar(8), ppu)
      .input("siglas_mantenimiento", sql.VarChar(200), siglas_mantenimiento)
      .execute("MANT.dbo.man_procInsRelacionMantencionPreventiva_NEW_GML");

    return {
      success: true,
      message: "Registro de mantención preventiva creado correctamente.",
    };
  } catch (error: any) {
    console.error("Error en createMantencionPreventivaService:", error);
    return {
      success: false,
      message: error.message || "Error al registrar la mantención preventiva.",
    };
  }
};

// Busca la ot preventiva por numero de bus o placa paternte y id de orden para mostrarlo de primera instancia al momento de ingresar a esa ot en especifica

export const getSiglasPreventivasByFlotaService = async (
  pool: ConnectionPool,
  input: GetSiglasPreventivasByFlotaInput
): Promise<GetSiglasPreventivasByFlotaResponse> => {
  const { codigo_flota, id_orden_trabajo } = input;

  try {
    const result = await pool
      .request()
      .input("codigo_flota", sql.Int, codigo_flota)
      .input("id_orden_trabajo", sql.BigInt, id_orden_trabajo)
      .execute("MANT.dbo.man_procGetMantencionesPreventivasByFlota_GML");

    const data = result.recordset as SiglaPreventivaRegistro[];

    return {
      success: true,
      message: "Consulta exitosa",
      data,
    };
  } catch (error: any) {
    console.error("Error en getSiglasPreventivasByFlotaService:", error);
    return {
      success: false,
      message: error.message || "Error al obtener siglas preventivas",
      data: [],
    };
  }
};

// Eliminar una falla preventiva

export const deleteMantencionPreventivaService = async (
  pool: ConnectionPool,
  data: DeleteMantencionPreventivaInput
): Promise<DeleteMantencionPreventivaResponse> => {
  const { id_rel_man_prev } = data;

  try {
    const result = await pool
      .request()
      .input("id_rel_man_prev", sql.BigInt, id_rel_man_prev)
      .execute("MANT.dbo.sp_delManPrev");

    const mensaje = result.recordset?.[0]?.respuesta ?? "Error desconocido";

    return {
      success: mensaje.includes("correctamente"),
      message: mensaje,
    };
  } catch (error: any) {
    console.error("Error en deleteMantencionPreventivaService:", error);
    return {
      success: false,
      message: error.message || "Error al eliminar mantención preventiva.",
    };
  }
};
