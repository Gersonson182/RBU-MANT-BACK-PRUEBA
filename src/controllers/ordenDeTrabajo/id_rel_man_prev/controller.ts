import { Request, Response } from "express";
import { connectDB } from "../../../helpers/db";
import { deleteMantencionPreventivaService } from "../../../services/ordenDeTrabajo/services";

export const DELETE = async (req: Request, res: Response) => {
  try {
    const { id_rel_man_prev } = req.params;

    if (!id_rel_man_prev) {
      return res.status(400).json({
        success: 0,
        message: "Debe proporcionar un id_rel_man_prev válido en la URL.",
      });
    }

    const pool = await connectDB();
    const result = await deleteMantencionPreventivaService(pool, {
      id_rel_man_prev: Number(id_rel_man_prev),
    });

    return res.json({
      success: result.success ? 1 : 0,
      action: result.success ? "DELETE" : "ERROR",
      message: result.message,
    });
  } catch (error) {
    console.error("Error en DELETE mantención preventiva:", error);
    return res.status(500).json({
      success: 0,
      message: "Error en el servidor al eliminar la mantención preventiva.",
    });
  }
};
