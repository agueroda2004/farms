import prisma from "../prismaClient.js";

export const createCerdaRemovida = async (data) => {
  const { causa, observacion, fecha, granja_id, cerda_id } = data;

  const cerdaActual = await prisma.cerda.findUnique({
    where: { id: cerda_id },
  });

  const [cerdaRemovida, updateCerda] = await prisma.$transaction([
    prisma.cerda_Removida.create({
      data: {
        causa,
        observacion,
        fecha,
        condicion_anterior: cerdaActual.condicion,
        granja: { connect: { id: granja_id } },
        cerda: { connect: { id: cerda_id } },
      },
    }),
    prisma.cerda.update({
      where: { id: cerda_id },
      data: {
        activo: false,
        jaula_id: null,
        condicion: causa,
      },
    }),
  ]);
  return { cerdaRemovida, updateCerda };
};

export const listCerdasRemovidas = async (granja_id) => {
  return await prisma.cerda_Removida.findMany({ where: { granja_id } });
};

export const getCerdaRemovidaById = async (id) => {
  return await prisma.cerda_Removida.findUnique({ where: { id } });
};

export const updateCerdaRemovida = async (id, data) => {
  return await prisma.cerda_Removida.update({ where: { id }, data });
};

export const deleteCerdaRemovida = async (data) => {
  const { id, cerda_id, jaula_id } = data;

  const cerdaRemovida = await prisma.cerda_Removida.findUnique({
    where: { id: id },
  });
  console.log(cerdaRemovida);
  const [deleteCerdaRemovida, updateCerda] = await prisma.$transaction([
    prisma.cerda_Removida.delete({ where: { id: id } }),
    prisma.cerda.update({
      where: { id: cerda_id },
      data: {
        activo: true,
        jaula_id: Number(jaula_id),
        condicion: cerdaRemovida.condicion_anterior,
      },
    }),
  ]);
  return { deleteCerdaRemovida, updateCerda };
};
