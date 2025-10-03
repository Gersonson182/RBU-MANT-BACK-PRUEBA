"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asyncHandler_1 = require("../../helpers/asyncHandler");
const controller_1 = require("../../controllers/ordenDeTrabajo/controller");
const router = (0, express_1.Router)();
router.get("/ot", (0, asyncHandler_1.asyncHandler)(controller_1.GET));
// Crear una nueva OT
router.post("/orden-trabajo", (0, asyncHandler_1.asyncHandler)(controller_1.POST));
// Soft delete de OT
router.delete("/orden-trabajo/:id", (0, asyncHandler_1.asyncHandler)(controller_1.DELETE));
exports.default = router;
