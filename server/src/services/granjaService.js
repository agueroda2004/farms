import prisma from "../prismaClient.js";

export const createGranja = async (data) => {
  const { nombre } = data;
  return prisma.granja.create({ data: { nombre } });
};

export const listGranjas = async () => {
  return prisma.granja.findMany();
};

export const getGranjaById = async (id) => {
  return prisma.granja.findUnique({ where: { id } });
};

export const updateGranja = async (id, data) => {
  const { nombre, activo } = data;
  const granja = await prisma.granja.findUnique({ where: { id } });
  if (!granja) {
    throw new Error("Granja not found");
  }
  return prisma.granja.update({ where: { id }, data: { nombre, activo } });
};

export const deleteGranja = async (id) => {
  return prisma.granja.delete({ where: { id: Number(id) } });
};
