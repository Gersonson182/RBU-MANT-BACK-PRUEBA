"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("../../../../controllers/ordenDeTrabajo/id_orden_trabajo/ot_preventivo/controller");
const asyncHandler_1 = require("../../../../helpers/asyncHandler");
const router = (0, express_1.Router)();
router.post("/ot_preventivo/POST", (0, asyncHandler_1.asyncHandler)(controller_1.CREATE));
exports.default = router;
