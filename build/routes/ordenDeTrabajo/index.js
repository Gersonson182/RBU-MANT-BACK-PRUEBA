"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.filtrosOrdenTrabajo = exports.OTGeneral = void 0;
const route_1 = __importDefault(require("./route"));
exports.OTGeneral = route_1.default;
const route_2 = __importDefault(require("./filtrosOrdenTrabajo/route"));
exports.filtrosOrdenTrabajo = route_2.default;
