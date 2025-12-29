import prisma from "../prismaClient.js";
import { AppError } from "../errors/appError.js";

export const createJaula = async (data, granja_id) => {
  const { nombre } = data;

  await validateJaulaNameUnique(nombre, granja_id);

  return prisma.jaula.create({
    data: { nombre, granja_id },
  });
};

export const listJaulas = async (granja_id) => {
  return prisma.jaula.findMany({
    where: { granja_id: granja_id },
  });
};

export const getJaulaById = async (id, granja_id) => {
  const jaula = await validateJaulaExists(id, granja_id);
  return jaula;
};

export const updateJaula = async (id, granja_id, data) => {
  const { nombre, activo } = data;
  const dataToUpdate = {};

  const jaula = await validateJaulaExists(id, granja_id);

  if (nombre !== undefined) {
    if (nombre !== jaula.nombre) {
      await validateJaulaNameUnique(nombre, granja_id);
    }
    dataToUpdate.nombre = nombre;
  }
  if (activo !== undefined) dataToUpdate.activo = activo;

  return prisma.jaula.update({
    where: { id: id },
    data: dataToUpdate,
  });
};

export const deleteJaula = async (id, granja_id) => {
  const jaula = await validateJaulaExists(id, granja_id, true);

  if (jaula.cerdas.length > 0 || jaula.berracos.length > 0) {
    const [updatedJaula] = await prisma.$transaction([
      prisma.jaula.update({
        where: { id },
        data: { activo: false },
      }),
      prisma.cerda.updateMany({
        where: { jaula_id: id },
        data: { jaula_id: null },
      }),
      prisma.berraco.updateMany({
        where: { jaula_id: id },
        data: { jaula_id: null },
      }),
    ]);

    return updatedJaula;
  }

  return prisma.jaula.delete({ where: { id } });
};

const validateJaulaExists = async (id, granja_id, withRelations = false) => {
  const jaula = await prisma.jaula.findFirst({
    where: { id: id, granja_id: granja_id, activo: true },
    include: withRelations ? { cerdas: true, berracos: true } : undefined,
  });

  if (!jaula) throw new AppError("JAULA_NOT_FOUND", 404);
  return jaula;
};

const validateJaulaNameUnique = async (nombre, granja_id) => {
  const jaula = await prisma.jaula.findFirst({
    where: { nombre: nombre, granja_id: granja_id, activo: true },
  });

  if (jaula) throw new AppError("JAULA_NAME_EXISTS", 409);
};
