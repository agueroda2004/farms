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
  const { nombre, estado } = data;
  const dataToUpdate = {};

  if (nombre !== undefined) dataToUpdate.nombre = nombre;
  if (estado !== undefined) dataToUpdate.estado = estado;

  return prisma.jaula.update({
    where: { id: id },
    data: dataToUpdate,
  });
};

export const deleteJaula = async (id) => {
  return prisma.jaula.delete({ where: { id: id } });
};

export const desactivarJaula = async (id, data) => {
  const tipoAnimal = ["cerda", "berraco"];
  const { animal } = data;
  const jaula = await prisma.jaula.findUnique({ where: { id: id } });

  if (!jaula) {
    throw new Error("Jaula not found.");
  }

  if (!tipoAnimal.includes(animal)) {
    throw new Error("Animal does not exist.");
  }

  if (animal === "cerda") {
    const [deleteJaula, updateCerda] = await prisma.$transaction([
      prisma.jaula.update({ where: { id: id }, data: { activo: false } }),
      prisma.cerda.update({
        where: { jaula_id: id },
        data: { jaula_id: null },
      }),
    ]);
    return { deleteJaula, updateCerda };
  }

  if (animal === "berraco") {
    const [deleteJaula, updateBerraco] = await prisma.$transaction([
      prisma.jaula.update({ where: { id: id }, data: { activo: false } }),
      prisma.berraco.update({
        where: { jaula_id: id },
        data: { jaula_id: null },
      }),
    ]);
    return { deleteJaula, updateBerraco };
  }
};
