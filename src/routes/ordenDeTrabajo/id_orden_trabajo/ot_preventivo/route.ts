import { Router } from "express";
import { CREATE } from "../../../../controllers/ordenDeTrabajo/id_orden_trabajo/ot_preventivo/controller";
import { asyncHandler } from "../../../../helpers/asyncHandler";

const router = Router();

router.post("/ot_preventivo/POST", asyncHandler(CREATE));

export default router;
