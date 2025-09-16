import sql, { ConnectionPool } from "mssql";

export const loginUser = async ({
  pool,
  values,
}: {
  pool: ConnectionPool;
  values: { usuario: string };
}) => {
  const request = await pool
    .request()
    .input("item", sql.SmallInt, 1)
    .input("user_name", sql.VarChar(50), values.usuario)
    .execute("sp_login");

  if (!request || !request.recordset || request.recordset.length === 0)
    return null;

  console.log("El request es:", request);

  return request.recordset[0];
};

export const getPermissionsByProfile = async ({
  pool,
  values,
}: {
  pool: ConnectionPool;
  values: { idUsuario: number };
}) => {
  const request = await pool
    .request()
    .input("id_usuario", sql.Int, values.idUsuario)
    .input("id_sistema", sql.Int, 5)
    .execute("MAESTRA.dbo.fa_procGetModuleAccess");

  if (!request || !request.recordset || request.recordset.length === 0)
    return [];

  return request.recordset[0];
};
