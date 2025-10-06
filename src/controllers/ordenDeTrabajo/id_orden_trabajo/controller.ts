import { Request, Response } from "express";
import { connectDB } from "../../../helpers/db";
import {
  getOrderDetailsService,
  updateFallaService,
} from "../../../services/ordenDeTrabajo/services";
import type { UpdateFallaInput } from "../../../types/ordenDeTrabajo/ordenDeTrabajo";

export const GET = async (req: Request, res: Response) => {
  const { idOrden } = req.params;

  if (!idOrden) return res.status(400).json({ message: "Falta idOrden" });

  try {
    const pool = await connectDB();
    const details = await getOrderDetailsService(pool, Number(idOrden));

    if (!details) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }

    return res.status(200).json(details);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

export const UPDATE = async (req: Request, res: Response) => {
  try {
    const input: UpdateFallaInput = req.body;
    const pool = await connectDB();

    if (!input.idOrden || !input.idFallaPrincipal) {
      return res.status(400).json({
        success: 0,
        action: "ERROR",
        affected_rows: 0,
        message: "Parámetros obligatorios faltantes: idOrden, idFallaPrincipal",
      });
    }

    const result = await updateFallaService(pool, input);

    if (result.success === 1) {
      return res.json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    console.error("Error en updateFallaController:", error);
    return res.status(500).json({
      success: 0,
      action: "ERROR",
      affected_rows: 0,
      message: "Error en el servidor al actualizar la falla",
    });
  }
};
