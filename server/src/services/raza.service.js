import prisma from "../prismaClient.js";
import { AppError } from "../errors/appError.js";

export const createRaza = async (data, granja_id) => {
  const { nombre } = data;

  await validateRazaNameUnique(nombre, granja_id);

  return prisma.raza.create({ data: { nombre, granja_id } });
};

export const listRazas = async (granja_id) => {
  return prisma.raza.findMany({
    where: { granja_id: granja_id },
  });
};

export const getRazaById = async (id, granja_id) => {
  const raza = await validateRazaExists(id, granja_id);
  return raza;
};

export const updateRaza = async (id, granja_id, data) => {
  const { nombre, activo } = data;
  const dataToUpdate = {};

  const raza = await validateRazaExists(id, granja_id);
  if (nombre !== undefined) {
    if (nombre !== raza.nombre) {
      await validateRazaNameUnique(nombre, granja_id);
    }

    dataToUpdate.nombre = nombre;
  }
  if (activo !== undefined) dataToUpdate.activo = activo;

  return prisma.raza.update({ where: { id: id }, data: dataToUpdate });
};

export const deleteRaza = async (id, granja_id) => {
  const raza = await validateRazaExists(id, granja_id, true);

  if (raza.cerdas.length > 0 || raza.berracos.length > 0) {
    const updatedRaza = await prisma.raza.update({
      where: { id },
      data: { activo: false },
    });
    return updatedRaza;
  }

  return prisma.raza.delete({ where: { id: id } });
};

const validateRazaExists = async (id, granja_id, withRelations = false) => {
  const raza = await prisma.raza.findFirst({
    where: { id: id, granja_id: granja_id, activo: true },
    include: withRelations ? { cerdas: true, berracos: true } : undefined,
  });

  if (!raza) {
    throw new AppError("RAZA_NOT_FOUND", 404);
  }
  return raza;
};

const validateRazaNameUnique = async (nombre, granja_id) => {
  const raza = await prisma.raza.findFirst({
    where: { nombre: nombre, granja_id: granja_id, activo: true },
  });
  if (raza) {
    throw new AppError("RAZA_NAME_EXISTS", 400);
  }
  return raza;
};
