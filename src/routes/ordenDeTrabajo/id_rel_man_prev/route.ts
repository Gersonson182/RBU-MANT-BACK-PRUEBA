import { Router } from "express";
import { DELETE } from "../../../controllers/ordenDeTrabajo/id_rel_man_prev/controller";
import { asyncHandler } from "../../../helpers/asyncHandler";

const router = Router();

// DELETE mantención preventiva
router.delete("/mantencion-preventiva/:id_rel_man_prev", asyncHandler(DELETE));

export default router;
