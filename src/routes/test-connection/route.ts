import { Router } from "express";
import { GET } from "../../controllers/test-connection/controller";
import { asyncHandler } from "../../helpers/asyncHandler";

const router = Router();

router.get("/test-connection", asyncHandler(GET));

export default router;
