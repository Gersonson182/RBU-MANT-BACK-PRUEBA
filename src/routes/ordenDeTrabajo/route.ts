import { Router } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { GET } from "../../controllers/ordenDeTrabajo/controller";

const router = Router();

router.get("/ot", asyncHandler(GET));

export default router;
