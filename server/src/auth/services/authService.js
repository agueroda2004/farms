import prisma from "../../prismaClient.js";

export const getUsuarioById = async (id) => {
  return prisma.usuario.findUnique({ where: { id } });
};
