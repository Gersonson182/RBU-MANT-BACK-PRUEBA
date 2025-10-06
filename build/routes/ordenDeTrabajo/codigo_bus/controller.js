"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("../../../controllers/ordenDeTrabajo/codigo_bus/controller");
const asyncHandler_1 = require("../../../helpers/asyncHandler");
const router = (0, express_1.Router)();
// Ejemplo de uso:
// GET /api/mantencion-preventiva?numeroBus=2081
// GET /api/mantencion-preventiva?placaPatente=TWDH54
router.get("/mantencion-preventiva", (0, asyncHandler_1.asyncHandler)(controller_1.getLatestMaintenanceController));
exports.default = router;
