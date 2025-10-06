import { Request, Response } from "express";
import { connectDB } from "../../../helpers/db";
import { deleteFallaService } from "../../../services/ordenDeTrabajo/services";
import type { DeleteFallaInput } from "../../../types/ordenDeTrabajo/ordenDeTrabajo";

export const deleteFallaController = async (req: Request, res: Response) => {
  try {
    const pool = await connectDB();

    const input: DeleteFallaInput = {
      item: req.body.item ?? 0,
      idRelacionFalla: Number(req.params.idRelacionFalla),
    };

    const result = await deleteFallaService(pool, input);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error en deleteFallaController:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor al eliminar la falla.",
    });
  }
};
