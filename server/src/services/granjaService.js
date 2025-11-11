import prisma from "../prismaClient.js";

export const createGranja = async (data) => {
  return prisma.granja.create({ data });
};

export const listGranjas = async () => {
  return prisma.granja.findMany();
};

export const getGranjaById = async (id) => {
  return prisma.granja.findUnique({ where: { id } });
};

export const updateGranja = async (id, data) => {
  return prisma.granja.update({ where: { id }, data });
};

export const deleteGranja = async (id) => {
  return prisma.granja.delete({ where: { id } });
};
