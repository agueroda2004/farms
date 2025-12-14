import prisma from "../prismaClient.js";

export const createRaza = async (data) => {
  const { nombre, granja_id } = data;
  return prisma.raza.create({ data: { nombre, granja_id } });
};

export const listRazas = async (granja_id) => {
  return prisma.raza.findMany({
    where: { granja_id: granja_id },
  });
};

export const getRazaById = async (id) => {
  return prisma.raza.findUnique({ where: { id: id } });
};

export const updateRaza = async (id, data) => {
  const { nombre, activo } = data;
  const dataToUpdate = {};

  if (nombre !== undefined) dataToUpdate.nombre = nombre;
  if (activo !== undefined) dataToUpdate.activo = activo;

  return prisma.raza.update({ where: { id: id }, data: dataToUpdate });
};

export const deleteRaza = async (id) => {
  return prisma.raza.delete({ where: { id: id } });
};
