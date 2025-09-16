"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = void 0;
const db_1 = require("../../helpers/db");
const GET = async (req, res) => {
    try {
        const isConnected = await (0, db_1.isDBConnected)();
        return res.status(200).json({ isConnected });
    }
    catch {
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.GET = GET;
