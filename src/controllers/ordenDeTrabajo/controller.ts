import { Request, Response } from "express";
import { connectDB } from "../../helpers/db";
import { getOrdenesTrabajo } from "../../services/ordenDeTrabajo/services";

export const GET = async (req: Request, res: Response) => {
  try {
    const pool = await connectDB();
    const nroOT = req.query.nroOT ? Number(req.query.nroOT) : undefined;
    const codTaller = req.query.codTaller
      ? Number(req.query.codTaller)
      : undefined;
    const nroBus = req.query.nroBus ? Number(req.query.nroBus) : undefined;
    const estadoOT = req.query.estadoOT
      ? Number(req.query.estadoOT)
      : undefined;
    const tipoOT = req.query.tipoOT ? Number(req.query.tipoOT) : undefined;
    const fechaIngreso = req.query.fechaIngreso as string | undefined;
    const fechaSalida = req.query.fechaSalida as string | undefined;
    const nroManager = req.query.nroManager
      ? Number(req.query.nroManager)
      : undefined;
    const pagina = req.query.pagina ? Number(req.query.pagina) : 0;

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
      pagina,
    });

    // respuesta al cliente
    res.json({
      total,
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
