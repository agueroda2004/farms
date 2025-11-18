import prisma from "../prismaClient.js";

// ✅
export const createCerda = async (data) => {
  return await prisma.cerda.create({ data });
};

export const listCerdasActivas = async (granja_id) => {
  return await prisma.cerda.findMany({
    where: { granja_id: granja_id, activo: true },
  });
};

export const listCerdas = async (granja_id) => {
  return await prisma.cerda.findMany({
    where: { granja_id: granja_id },
  });
};

export const getCerdaById = async (id) => {
  return await prisma.cerda.findUnique({ where: { id: id } });
};

export const updateCerda = async (id, data) => {
  return await prisma.cerda.update({ where: { id: id }, data });
};

export const deleteCerda = async (id) => {
  return await prisma.cerda.delete({ where: { id: id } });
};
