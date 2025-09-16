"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authPermissionRouter = exports.authRouter = void 0;
const route_1 = __importDefault(require("./[usuario]/route"));
exports.authRouter = route_1.default;
const route_2 = __importDefault(require("./permisos/[idUsuario]/route"));
exports.authPermissionRouter = route_2.default;
