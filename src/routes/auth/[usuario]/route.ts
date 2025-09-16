import { Router } from "express";
import { asyncHandler } from "../../../helpers/asyncHandler";
import { GET } from "../../../controllers/auth/[usuario]/controller";

const router = Router();

router.get("/:usuario", asyncHandler(GET));

export default router;
