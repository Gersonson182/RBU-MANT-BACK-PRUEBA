import { Router } from "express";
import { getLatestMaintenanceController } from "../../../controllers/ordenDeTrabajo/codigo_bus/controller";
import { asyncHandler } from "../../../helpers/asyncHandler";

const router = Router();

// Ejemplo de uso:
// GET /api/mantencion-preventiva?numeroBus=2081
// GET /api/mantencion-preventiva?placaPatente=TWDH54
router.get(
  "/mantencion-preventiva",
  asyncHandler(getLatestMaintenanceController)
);

export default router;
