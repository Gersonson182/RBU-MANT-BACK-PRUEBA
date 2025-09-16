"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asyncHandler_1 = require("../../../helpers/asyncHandler");
const controller_1 = require("../../../controllers/auth/[usuario]/controller");
const router = (0, express_1.Router)();
router.get("/:usuario", (0, asyncHandler_1.asyncHandler)(controller_1.GET));
exports.default = router;
