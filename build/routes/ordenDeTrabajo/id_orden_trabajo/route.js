"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("../../../controllers/ordenDeTrabajo/id_orden_trabajo/controller");
const asyncHandler_1 = require("../../../helpers/asyncHandler");
const router = (0, express_1.Router)();
// GET detalles por id de orden
router.get("/ordenes/:idOrden/details", (0, asyncHandler_1.asyncHandler)(controller_1.GET));
exports.default = router;
