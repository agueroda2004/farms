import prisma from "../prismaClient.js";

export const createBerraco = async (data) => {
  const { nombre, observacion, granja_id, raza_id, jaula_id } = data;
  const berraco = await prisma.berraco.create({
    data: {
      nombre,
      observacion,
      granja: { connect: { id: Number(granja_id) } },
      raza: { connect: { id: Number(raza_id) } },
      jaula: { connect: { id: Number(jaula_id) } },
    },
  });
  return berraco;
};

export const listBerracosByGranja = async (granja_id) => {
  return await prisma.berraco.findMany({
    where: { granja_id: granja_id },
  });
};

export const getBerracoById = async (id) => {
  return await prisma.berraco.findUnique({ where: { id: id } });
};

export const updateBerraco = async (id, data) => {
  return await prisma.berraco.update({ where: { id: id }, data });
};

export const deleteBerraco = async (id) => {
  return await prisma.berraco.delete({ where: { id: id } });
};
