import prisma from "../prismaClient.js";
import bcrypt from "bcryptjs";

export const createUsuario = async (data) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  return prisma.usuario.create({ data: { ...data, password: hashedPassword } });
};

export const listUsuarios = async () => {
  return prisma.usuario.findMany();
};

export const getUsuarioById = async (id) => {
  return prisma.usuario.findUnique({ where: { id } });
};

export const updateUsuario = async (id, data) => {
  return prisma.usuario.update({ where: { id }, data });
};

export const deleteUsuario = async (id) => {
  return prisma.usuario.delete({ where: { id } });
};
