import prisma from "../prismaClient.js";

export const createBerracoRemovido = async (data) => {
  const { causa, observacion, fecha, granja_id, berraco_id } = data;

  const berraco = await prisma.berraco.findUnique({
    where: { id: Number(berraco_id) },
  });

  const berracoRemovido = await prisma.berraco_Removido.create({
    data: {
      causa,
      condicion_anterior: berraco.condicion,
      observacion,
      fecha,
      granja: { connect: { id: Number(granja_id) } },
      berraco: { connect: { id: Number(berraco_id) } },
    },
  });
  return berracoRemovido;
};

export const listBerracosRemovidosByGranja = async (granja_id) => {
  return await prisma.berraco_Removido.findMany({
    where: { granja_id: granja_id },
  });
};

export const getBerracoById = async (id) => {
  return await prisma.berraco_Removido.findUnique({ where: { id: id } });
};

export const updateBerracoRemovido = async (id, data) => {
  return await prisma.berraco_Removido.update({ where: { id: id }, data });
};

export const deleteBerracoRemovido = async (id) => {
  return await prisma.berraco_Removido.delete({ where: { id: id } });
};
