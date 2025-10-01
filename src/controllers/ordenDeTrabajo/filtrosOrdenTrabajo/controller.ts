import { Request, Response } from "express";
import { connectDB } from "../../../helpers/db";
import { getDataFiltrosMant } from "../../../services/ordenDeTrabajo/services";
import type { DataFiltrosMant } from "../../../types/ordenDeTrabajo/ordenDeTrabajo";

export const getDataFiltrosMantController = async (
	req: Request,
	res: Response,
) => {
	try {
		const pool = await connectDB();
		const tipo = req.query.tipo as keyof DataFiltrosMant | undefined;

		const data = await getDataFiltrosMant(pool, tipo);

		return res.status(200).json(data);
	} catch (error) {
		console.error("Error en getDataFiltrosMantController:", error);
		res.status(500).json({
			message: "Error al obtener filtros de órdenes de trabajo",
			error: (error as Error).message,
		});
	}
};
