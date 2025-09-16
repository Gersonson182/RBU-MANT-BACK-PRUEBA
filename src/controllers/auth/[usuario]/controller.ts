import { Request, Response } from "express";
import { connectDB } from "../../../helpers/db";
import { loginUser } from "../../../services/auth";
import { formatObjectToCamelCase } from "../../../utils/formatters";

export const GET = async (req: Request, res: Response) => {
  try {
    const { usuario } = req.params;
    console.log("el parametro que recibo es:", usuario);

    if (!usuario)
      return res.status(400).json({ message: "Usuario no especificado" });

    const pool = await connectDB();
    const userLogged = await loginUser({ pool, values: { usuario } });

    if (!userLogged)
      return res.status(401).json({ message: "Usuario no autorizado" });

    return res.status(200).json(formatObjectToCamelCase(userLogged));
  } catch (error) {
    return (
      res.status(500).json({ message: "Internal server error" }),
      console.log(error)
    );
  }
};
