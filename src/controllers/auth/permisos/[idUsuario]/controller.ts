import { Request, Response } from "express";
import { connectDB } from "../../../../helpers/db";
import { getPermissionsByProfile } from "../../../../services/auth";

export const GET = async (req: Request, res: Response) => {
	try {
		const { idUsuario } = req.params;

		if (!idUsuario)
			return res.status(400).json({ message: "Usuario no especificado" });

		const pool = await connectDB();
		const permissions = await getPermissionsByProfile({
			pool,
			values: { idUsuario: parseInt(idUsuario) },
		});

		console.log(
			">>> API /auth/permisos response (antes de enviar):",
			permissions,
		);

		if (!permissions)
			return res.status(404).json({ message: "No se encontraron permisos" });

		return res.status(200).json(permissions);
	} catch (error) {
		console.error(" Error en /auth/permisos:", error);
		return res.status(500).json({ message: "Internal server error" });
	}
};
