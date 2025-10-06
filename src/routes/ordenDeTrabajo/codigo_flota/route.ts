import { Router } from "express";
import { getSiglasPreventivasController } from "../../../controllers/ordenDeTrabajo/codigo_flota/controller";
import { asyncHandler } from "../../../helpers/asyncHandler";
const router = Router();

/**
 * Endpoint:
 * GET http://localhost:4020/api/ordenDeTrabajo/siglas-preventivas?codigoFlota=3574
 */
router.get("/siglas-preventivas", asyncHandler(getSiglasPreventivasController));

export default router;
