"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("../../../controllers/ordenDeTrabajo/filtrosOrdenTrabajo/controller");
const router = (0, express_1.Router)();
router.get("/filtros", controller_1.getDataFiltrosMantController);
exports.default = router;
