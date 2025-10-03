import { Router } from "express";
import {
  getSistemasController,
  getSubSistemasController,
  getAllSubSistemasController,
} from "../../../controllers/ordenDeTrabajo/subSistemas/controller";
import { asyncHandler } from "../../../helpers/asyncHandler";

const router = Router();

//sistemas lista todos los sistemas principales
router.get("/sistemas", asyncHandler(getSistemasController));

//sistemas/:id_falla_principal  lista sub sistemas de un sistema específico
router.get(
  "/sistemas/:id_falla_principal",
  asyncHandler(getSubSistemasController)
);

//sub-sistemas lista todos los sub sistemas
router.get("/sub-sistemas", asyncHandler(getAllSubSistemasController));

export default router;
