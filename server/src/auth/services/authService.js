import prisma from "../../prismaClient.js";

export const getUsuarioByEmail = async (email) => {
  return prisma.usuario.findUnique({ where: { email } });
};
