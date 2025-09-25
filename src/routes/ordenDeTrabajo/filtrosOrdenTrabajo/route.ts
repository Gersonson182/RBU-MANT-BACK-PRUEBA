import { Router } from "express";
import { getDataFiltrosMantController } from "../../../controllers/ordenDeTrabajo/filtrosOrdenTrabajo/controller";

const router = Router();

router.get("/filtros", getDataFiltrosMantController);

export default router;
