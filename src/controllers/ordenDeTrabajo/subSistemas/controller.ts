import { Request, Response } from "express";
import { connectDB } from "../../../helpers/db";
import {
  getSistemas,
  getSubSistemas,
  getAllSubSistemas,
} from "../../../services/ordenDeTrabajo/services";

export const getSistemasController = async (req: Request, res: Response) => {
  try {
    const pool = await connectDB();
    const sistemas = await getSistemas(pool);
    return res.status(200).json(sistemas);
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
  }
};

export const getSubSistemasController = async (req: Request, res: Response) => {
  try {
    const { id_falla_principal } = req.params;
    if (!id_falla_principal) {
      return res
        .status(400)
        .json({ message: "Debe indicar id_falla_principal" });
    }

    const pool = await connectDB();
    const subSistemas = await getSubSistemas(pool, Number(id_falla_principal));
    return res.status(200).json(subSistemas);
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
  }
};

export const getAllSubSistemasController = async (
  req: Request,
  res: Response
) => {
  try {
    const pool = await connectDB();
    const subSistemas = await getAllSubSistemas(pool);
    return res.status(200).json(subSistemas);
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
  }
};
