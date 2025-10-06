import { Request, Response } from "express";
import { connectDB } from "../../helpers/db";
import {
  getOrdenesTrabajo,
  createOrdenTrabajo,
  softDeleteOrdenTrabajo,
} from "../../services/ordenDeTrabajo/services";
import type { CreateOrdenTrabajoInput } from "../../types/ordenDeTrabajo/ordenDeTrabajo";

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

export const POST = async (req: Request, res: Response) => {
  try {
    const input: CreateOrdenTrabajoInput = req.body;
    const pool = await connectDB();

    // Validaciones básicas
    if (
      !input.id_personal_ingreso ||
      !input.id_tipo_orden ||
      !input.codigo_flota ||
      !input.detalle_ingreso ||
      !input.codigo_taller
    ) {
      return res
        .status(400)
        .json({ message: "Faltan datos obligatorios para crear la OT" });
    }

    // Validar fallas solo si no es preventiva
    if (
      input.id_tipo_orden !== 2 &&
      (!input.fallas || input.fallas.length === 0)
    ) {
      return res
        .status(400)
        .json({ message: "Debe ingresar al menos una falla" });
    }

    const orden = await createOrdenTrabajo(pool, input);

    return res
      .status(201)
      .json({ message: "Orden creada con éxito", data: orden });
  } catch (error: any) {
    console.error("Error al crear la OT:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const DELETE = async (req: Request, res: Response) => {
  try {
    const pool = await connectDB();
    const idOrden = Number(req.params.id);

    if (isNaN(idOrden)) {
      return res.status(400).json({
        success: false,
        message: "El id_orden_trabajo debe ser un número válido",
      });
    }

    const result = await softDeleteOrdenTrabajo(pool, idOrden);

    res.json({
      success: result.respuesta === 1,
      ...result,
    });
  } catch (error: any) {
    console.error("Error en deleteOrdenTrabajo:", error);
    res.status(500).json({
      success: false,
      message: "Error al ejecutar soft delete de la OT",
      error: error.message,
    });
  }
};
