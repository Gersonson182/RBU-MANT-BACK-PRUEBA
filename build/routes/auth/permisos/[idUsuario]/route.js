"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asyncHandler_1 = require("../../../../helpers/asyncHandler");
const controller_1 = require("../../../../controllers/auth/permisos/[idUsuario]/controller");
const router = (0, express_1.Router)();
router.get("/permisos/:idUsuario", (0, asyncHandler_1.asyncHandler)(controller_1.GET));
exports.default = router;
