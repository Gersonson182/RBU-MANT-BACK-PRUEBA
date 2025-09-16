"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = void 0;
const db_1 = require("../../../helpers/db");
const auth_1 = require("../../../services/auth");
const formatters_1 = require("../../../utils/formatters");
const GET = async (req, res) => {
    try {
        const { usuario } = req.params;
        console.log("el parametro que recibo es:", usuario);
        if (!usuario)
            return res.status(400).json({ message: "Usuario no especificado" });
        const pool = await (0, db_1.connectDB)();
        const userLogged = await (0, auth_1.loginUser)({ pool, values: { usuario } });
        if (!userLogged)
            return res.status(401).json({ message: "Usuario no autorizado" });
        return res.status(200).json((0, formatters_1.formatObjectToCamelCase)(userLogged));
    }
    catch (error) {
        return (res.status(500).json({ message: "Internal server error" }),
            console.log(error));
    }
};
exports.GET = GET;
