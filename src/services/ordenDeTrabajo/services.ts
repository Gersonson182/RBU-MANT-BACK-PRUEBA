import sql, { ConnectionPool } from "mssql";
import {
  OrdenDeTrabajo,
  GetOrdenesTrabajoInput,
  DataFiltrosMant,
} from "../../types/ordenDeTrabajo/ordenDeTrabajo";

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

export const getDataFiltrosMant = async (
  pool: ConnectionPool
): Promise<DataFiltrosMant> => {
  // Función helper genérica para no repetir código
  const executeFilter = async <T>(item: number): Promise<T[]> => {
    const { recordset } = await pool
      .request()
      .input("item", sql.Int, item)
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
