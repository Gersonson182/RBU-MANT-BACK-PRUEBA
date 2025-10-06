"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("../../../controllers/ordenDeTrabajo/codigo_flota/controller");
const asyncHandler_1 = require("../../../helpers/asyncHandler");
const router = (0, express_1.Router)();
/**
 * Endpoint:
 * GET http://localhost:4020/api/ordenDeTrabajo/siglas-preventivas?codigoFlota=3574
 */
router.get("/siglas-preventivas", (0, asyncHandler_1.asyncHandler)(controller_1.getSiglasPreventivasController));
exports.default = router;
