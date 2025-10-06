import type { Request, Response } from "express";
import { connectDB } from "../../../../helpers/db";
import { getSiglasPreventivasByFlotaService } from "../../../../services/ordenDeTrabajo/services";

export const GET = async (req: Request, res: Response) => {
  try {
    const { codigo_flota, id_orden_trabajo } = req.query;

    if (!codigo_flota || !id_orden_trabajo) {
      return res.status(400).json({
        success: false,
        message:
          "Parámetros obligatorios faltantes: codigo_flota o id_orden_trabajo",
        data: [],
      });
    }

    const pool = await connectDB();

    const result = await getSiglasPreventivasByFlotaService(pool, {
      codigo_flota: Number(codigo_flota),
      id_orden_trabajo: Number(id_orden_trabajo),
    });

    return res.json(result);
  } catch (error: any) {
    console.error("Error en GET_SIGLAS_PREVENTIVAS_BY_FLOTA:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      data: [],
    });
  }
};
