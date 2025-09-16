import { Router } from "express";
import { asyncHandler } from "../../../../helpers/asyncHandler";
import { GET } from "../../../../controllers/auth/permisos/[idUsuario]/controller";

const router = Router();

router.get("/:permisos/:idUsuario", asyncHandler(GET));

export default router;
