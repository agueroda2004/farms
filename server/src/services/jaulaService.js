import prisma from "../prismaClient.js";

export const createJaula = async (data) => {
  return prisma.jaula.create({ data });
};

export const listJaulasActivas = async (granja_id) => {
  return prisma.jaula.findMany({
    where: { granja_id: granja_id, activo: true },
  });
};

export const listJaulas = async (granja_id) => {
  return prisma.jaula.findMany({
    where: { granja_id: granja_id },
  });
};

export const getJaulaById = async (id) => {
  return prisma.jaula.findUnique({ where: { id: id } });
};

export const updateJaula = async (id, data) => {
  return prisma.jaula.update({ where: { id: id }, data });
};

export const deleteJaula = async (id) => {
  return prisma.jaula.delete({ where: { id: id } });
};
