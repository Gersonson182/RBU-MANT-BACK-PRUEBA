import { Router } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { GET, POST, DELETE } from "../../controllers/ordenDeTrabajo/controller";

const router = Router();

router.get("/ot", asyncHandler(GET));

// Crear una nueva OT
router.post("/orden-trabajo", asyncHandler(POST));
// Soft delete de OT
router.delete("/orden-trabajo/:id", asyncHandler(DELETE));

export default router;
