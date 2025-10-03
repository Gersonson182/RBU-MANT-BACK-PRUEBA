"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("../../../controllers/ordenDeTrabajo/subSistemas/controller");
const asyncHandler_1 = require("../../../helpers/asyncHandler");
const router = (0, express_1.Router)();
//sistemas lista todos los sistemas principales
router.get("/sistemas", (0, asyncHandler_1.asyncHandler)(controller_1.getSistemasController));
//sistemas/:id_falla_principal  lista sub sistemas de un sistema específico
router.get("/sistemas/:id_falla_principal", (0, asyncHandler_1.asyncHandler)(controller_1.getSubSistemasController));
//sub-sistemas lista todos los sub sistemas
router.get("/sub-sistemas", (0, asyncHandler_1.asyncHandler)(controller_1.getAllSubSistemasController));
exports.default = router;
