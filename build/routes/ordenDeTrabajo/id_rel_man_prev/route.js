"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("../../../controllers/ordenDeTrabajo/id_rel_man_prev/controller");
const asyncHandler_1 = require("../../../helpers/asyncHandler");
const router = (0, express_1.Router)();
// DELETE mantención preventiva
router.delete("/mantencion-preventiva/:id_rel_man_prev", (0, asyncHandler_1.asyncHandler)(controller_1.DELETE));
exports.default = router;
