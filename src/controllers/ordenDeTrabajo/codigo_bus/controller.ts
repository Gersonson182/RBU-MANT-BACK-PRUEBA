import { Request, Response } from "express";
import { connectDB } from "../../../helpers/db";
import { getLatestMaintenance } from "../../../services/ordenDeTrabajo/services";

export const getLatestMaintenanceController = async (
  req: Request,
  res: Response
) => {
  try {
    const { numeroBus, placaPatente } = req.query;

    if (!numeroBus && !placaPatente) {
      return res.status(400).json({
        message:
          "Debe proporcionar 'numeroBus' o 'placaPatente' como parámetro.",
      });
    }

    const pool = await connectDB();
    const data = await getLatestMaintenance(
      pool,
      numeroBus ? Number(numeroBus) : undefined,
      placaPatente ? String(placaPatente) : undefined
    );

    if (!data || data.length === 0) {
      return res.status(404).json({
        message: "No se encontraron registros de mantención preventiva.",
      });
    }

    return res.status(200).json({
      message: "Consulta exitosa",
      data,
    });
  } catch (error: any) {
    console.error("Error en getLatestMaintenanceController:", error);
    return res.status(500).json({
      message: "Error al obtener la información de mantención preventiva.",
      error: error.message,
    });
  }
};
