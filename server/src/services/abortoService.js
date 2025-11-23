import prisma from "../prismaClient";

export const createAborto = async (data) => {
  const { fecha, hora, observacion, cerda_id, granja_id } = data;

  const cerda = await prisma.cerda.findUnique({
    where: { id: cerda_id },
  });

  const [aborto, updateCerda] = await prisma.$transaction([
    prisma.aborto.create({
      data: {
        fecha,
        hora,
        observacion,
        granja: { connect: { id: granja_id } },
        cerda: { connect: { id: cerda_id } },
        jaula: { connect: { id: cerda.jaula_id } },
      },
    }),
    prisma.cerda.update({
      where: { id: cerda_id },
      data: {
        estado: "aborto",
      },
    }),
  ]);
  return { aborto, updateCerda };
};

export const listAbortosByGranja = async (granja_id) => {
  return await prisma.aborto.findMany({
    where: { granja_id: granja_id },
  });
};

export const getAbortoById = async (id) => {
  return await prisma.aborto.findUnique({ where: { id: id } });
};

export const updateAborto = async (id, data) => {
  return await prisma.aborto.update({ where: { id: id }, data });
};

export const deleteAborto = async (data) => {
  const { id, cerda_id } = data;
  const aborto = await prisma.aborto.findUnique({
    where: { id: id },
  });

  const [deleteAborto, updateCerda] = await prisma.$transaction([
    prisma.aborto.delete({ where: { id: id } }),
    prisma.cerda.update({
      where: { id: cerda_id },
      data: {
        estado: aborto.condicion_anterior,
      },
    }),
  ]);

  return { deleteAborto, updateCerda };
};
