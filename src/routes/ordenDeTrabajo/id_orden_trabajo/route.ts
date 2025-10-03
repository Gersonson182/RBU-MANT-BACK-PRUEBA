import { Router } from "express";
import { GET } from "../../../controllers/ordenDeTrabajo/id_orden_trabajo/controller";
import { asyncHandler } from "../../../helpers/asyncHandler";

const router = Router();

// GET detalles por id de orden
router.get("/ordenes/:idOrden/details", asyncHandler(GET));

export default router;
