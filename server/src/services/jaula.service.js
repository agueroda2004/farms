import prisma from "../prismaClient.js";

export const createJaula = async (data) => {
  const { nombre, granja_id } = data;
  return prisma.jaula.create({
    data: { nombre, granja_id },
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
  const { nombre, activo } = data;
  const dataToUpdate = {};

  const jaula = await prisma.jaula.findUnique({ where: { id: id } });

  if (!jaula) {
    throw new Error("Jaula not found.");
  }

  if (nombre !== undefined) dataToUpdate.nombre = nombre;
  if (activo !== undefined) dataToUpdate.activo = activo;

  return prisma.jaula.update({
    where: { id: id },
    data: dataToUpdate,
  });
};

export const deleteJaula = async (id) => {
  const jaula = await prisma.jaula.findUnique({
    where: { id },
    include: { cerdas: true, berracos: true },
  });

  if (!jaula) {
    throw new Error("Jaula not found.");
  }

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
