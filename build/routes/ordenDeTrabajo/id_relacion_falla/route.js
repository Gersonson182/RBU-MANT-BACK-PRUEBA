"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("../../../controllers/ordenDeTrabajo/id_relacion_falla/controller");
const asyncHandler_1 = require("../../../helpers/asyncHandler");
const router = (0, express_1.Router)();
//  Eliminar definitivamente una falla por id_relacion_falla
router.delete("/falla/:idRelacionFalla", (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    req.body.item = 0; // modo eliminación real
    await (0, controller_1.deleteFallaController)(req, res);
}));
//  Vista previa de eliminación (cuenta técnicos e insumos antes de borrar)
router.get("/falla/:idRelacionFalla/preview", (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    req.body.item = 1; // modo preview
    await (0, controller_1.deleteFallaController)(req, res);
}));
exports.default = router;
