// controllers/OT/mantencionPreventivaController.ts
import type { Request, Response } from "express";
import { connectDB } from "../../../helpers/db";
import { getSiglasPreventivas } from "../../../services/ordenDeTrabajo/services.js";

/**
 * Controlador para obtener siglas preventivas por código de flota
 * Ejemplo de uso:
 * GET /api/ordenDeTrabajo/siglas-preventivas?codigoFlota=3574
 */
export const getSiglasPreventivasController = async (
  req: Request,
  res: Response
) => {
  try {
    const codigoFlota = Number(req.query.codigoFlota);

    if (!codigoFlota) {
      return res
        .status(400)
        .json({ message: "Debe especificar el parámetro codigoFlota" });
    }

    const pool = await connectDB();
    const data = await getSiglasPreventivas(pool, codigoFlota);

    if (!data.length) {
      return res.status(404).json({
        message:
          "No se encontraron siglas preventivas para el código de flota indicado",
        data: [],
      });
    }

    return res.status(200).json({
      message: "Consulta exitosa",
      data,
    });
  } catch (error: any) {
    console.error("Error al obtener siglas preventivas:", error);
    return res.status(500).json({ message: error.message });
  }
};
