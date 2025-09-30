import { Request, Response } from "express";
import { connectDB } from "../../helpers/db";
import { getOrdenesTrabajo } from "../../services/ordenDeTrabajo/services";

const toNumber = (val: any): number | undefined =>
  val !== undefined && !isNaN(Number(val)) ? Number(val) : undefined;

export const GET = async (req: Request, res: Response) => {
  try {
    const pool = await connectDB();

    const nroOT = toNumber(req.query.nroOT);
    const codTaller = toNumber(req.query.codTaller);
    const nroBus = toNumber(req.query.nroBus);
    const estadoOT = toNumber(req.query.estadoOT);
    const tipoOT = toNumber(req.query.tipoOT);
    const nroManager = toNumber(req.query.nroManager);

    const fechaIngreso = req.query.fechaIngreso
      ? new Date(req.query.fechaIngreso as string)
      : undefined;

    const fechaSalida = req.query.fechaSalida
      ? new Date(req.query.fechaSalida as string)
      : undefined;

    const pageIndex = toNumber(req.query.pagina) ?? 0;
    const pageSize = 15; // constante, configurable
    const offset = pageIndex * pageSize;

    // llamada al service
    const { data, total } = await getOrdenesTrabajo({
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
  } catch (error) {
    console.error("Error en getOrdenesTrabajoController:", error);
    res.status(500).json({
      message: "Error al obtener órdenes de trabajo",
      error: (error as Error).message,
    });
  }
};
