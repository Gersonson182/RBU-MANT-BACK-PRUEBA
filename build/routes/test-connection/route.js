"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("../../controllers/test-connection/controller");
const asyncHandler_1 = require("../../helpers/asyncHandler");
const router = (0, express_1.Router)();
router.get("/test-connection", (0, asyncHandler_1.asyncHandler)(controller_1.GET));
exports.default = router;
