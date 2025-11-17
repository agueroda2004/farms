import prisma from "../prismaClient.js";

// ✅
export const createRaza = async (data) => {
  return prisma.raza.create({ data });
};

// ✅
export const listRazasActivas = async (granja_id) => {
  return prisma.raza.findMany({
    where: { granja_id: granja_id, activo: true },
  });
};

// ✅
export const listRazas = async (granja_id) => {
  return prisma.raza.findMany({
    where: { granja_id: granja_id },
  });
};

// ✅
export const getRazaById = async (id) => {
  return prisma.raza.findUnique({ where: { id: id } });
};

// ✅
export const updateRaza = async (id, data) => {
  return prisma.raza.update({ where: { id: id }, data });
};

// ✅
export const deleteRaza = async (id) => {
  return prisma.raza.delete({ where: { id: id } });
};
