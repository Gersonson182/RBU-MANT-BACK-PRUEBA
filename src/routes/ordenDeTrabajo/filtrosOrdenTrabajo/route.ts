import { Router } from "express";
import { getDataFiltrosMantController } from "../../../controllers/ordenDeTrabajo/filtrosOrdenTrabajo/controller";
import { asyncHandler } from "../../../helpers/asyncHandler";

const router = Router();

router.get("/filtros", asyncHandler(getDataFiltrosMantController));

export default router;
