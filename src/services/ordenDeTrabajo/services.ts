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
	pool: ConnectionPool,
	tipo?: keyof DataFiltrosMant,
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
