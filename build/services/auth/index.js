"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPermissionsByProfile = exports.loginUser = void 0;
const mssql_1 = __importDefault(require("mssql"));
const loginUser = async ({ pool, values, }) => {
    const request = await pool
        .request()
        .input("item", mssql_1.default.SmallInt, 1)
        .input("user_name", mssql_1.default.VarChar(50), values.usuario)
        .execute("sp_login");
    if (!request || !request.recordset || request.recordset.length === 0)
        return null;
    console.log("El request es:", request);
    return request.recordset[0];
};
exports.loginUser = loginUser;
const getPermissionsByProfile = async ({ pool, values, }) => {
    const request = await pool
        .request()
        .input("id_usuario", mssql_1.default.Int, values.idUsuario)
        .input("id_sistema", mssql_1.default.Int, 5)
        .execute("MAESTRA.dbo.fa_procGetModuleAccess");
    if (!request || !request.recordset || request.recordset.length === 0)
        return [];
    return request.recordset[0];
};
exports.getPermissionsByProfile = getPermissionsByProfile;
