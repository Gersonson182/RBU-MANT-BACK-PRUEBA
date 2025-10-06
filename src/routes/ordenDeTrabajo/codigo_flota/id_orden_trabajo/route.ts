import { Router } from "express";
import { GET } from "../../../../controllers/ordenDeTrabajo/codigo_flota/id_orden_trabajo/controller";
import { asyncHandler } from "../../../../helpers/asyncHandler";

const router = Router();

/**
 * Endpoint:
 * GET http://localhost:4020/api/ordenDeTrabajo/siglas-preventivas?codigoFlota=3444&idOrdenTrabajo=1
 */
router.get("/ot_preventivo/siglas-preventivas", asyncHandler(GET));

export default router;
