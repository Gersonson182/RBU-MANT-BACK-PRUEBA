import { Request, Response } from "express";
import { isDBConnected } from "../../helpers/db";

export const GET = async (req: Request, res: Response) => {
  try {
    const isConnected = await isDBConnected();

    return res.status(200).json({ isConnected });
  } catch {
    return res.status(500).json({ message: "Internal server error" });
  }
};
