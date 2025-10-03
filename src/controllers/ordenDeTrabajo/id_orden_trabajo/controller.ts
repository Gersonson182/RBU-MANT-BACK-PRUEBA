import { Request, Response } from "express";
import { connectDB } from "../../../helpers/db";
import { getOrderDetailsService } from "../../../services/ordenDeTrabajo/services";

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
