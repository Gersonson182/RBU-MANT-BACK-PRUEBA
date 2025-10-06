import { Router } from "express";
import { deleteFallaController } from "../../../controllers/ordenDeTrabajo/id_relacion_falla/controller";
import { asyncHandler } from "../../../helpers/asyncHandler";

const router = Router();

//  Eliminar definitivamente una falla por id_relacion_falla
router.delete(
  "/falla/:idRelacionFalla",
  asyncHandler(async (req, res) => {
    req.body.item = 0; // modo eliminación real
    await deleteFallaController(req, res);
  })
);

//  Vista previa de eliminación (cuenta técnicos e insumos antes de borrar)
router.get(
  "/falla/:idRelacionFalla/preview",
  asyncHandler(async (req, res) => {
    req.body.item = 1; // modo preview
    await deleteFallaController(req, res);
  })
);

export default router;
