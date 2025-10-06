import { Router } from "express";
import {
  GET,
  UPDATE,
} from "../../../controllers/ordenDeTrabajo/id_orden_trabajo/controller";
import { asyncHandler } from "../../../helpers/asyncHandler";

const router = Router();

// GET detalles por id de orden
router.get("/ordenes/:idOrden/details", asyncHandler(GET));
// Update falla (correctiva o preventiva)
router.post("/falla", asyncHandler(UPDATE));

export default router;
