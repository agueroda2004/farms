import prisma from "../prismaClient.js";

export const createBerracoRemovido = async (data) => {
  const { causa, observacion, fecha, granja_id, berraco_id } = data;

  const berraco = await prisma.berraco.findUnique({
    where: { id: Number(berraco_id), activo: true },
  });

  if (!berraco) {
    throw new Error("Berraco not found.");
  }

  const [berracoRemovido, ..._] = await prisma.$transaction([
    prisma.berraco_Removido.create({
      data: {
        causa,
        condicion_anterior: berraco.condicion,
        observacion,
        fecha,
        granja: { connect: { id: Number(granja_id) } },
        berraco: { connect: { id: Number(berraco_id) } },
      },
    }),
    prisma.berraco.update({
      where: { id: Number(berraco_id) },
      data: {
        jaula_id: null,
        condicion: causa,
        activo: false,
      },
    }),
  ]);

  return berracoRemovido;
};

export const listBerracosRemovidos = async (granja_id) => {
  return await prisma.berraco_Removido.findMany({
    where: { granja_id: granja_id },
  });
};

export const getBerracoById = async (id) => {
  return await prisma.berraco_Removido.findUnique({ where: { id: id } });
};

export const updateBerracoRemovido = async (id, data) => {
  const { causa, observacion, fecha } = data;
  const dataToUpdate = {};

  if (causa !== undefined) dataToUpdate.causa = causa;
  if (observacion !== undefined) dataToUpdate.observacion = observacion;
  if (fecha !== undefined) {
    const monta = await prisma.servicio.findFirst({
      where: { berraco_id: id },
      take: 1,
      orderBy: { fecha: "desc" },
    });
    if (monta.fecha > fecha) {
      throw new Error("Fecha cannot be after the last service date.");
    }
    dataToUpdate.fecha = fecha;
  }

  return await prisma.berraco_Removido.update({
    where: { id: id },
    data: dataToUpdate,
  });
};

export const deleteBerracoRemovido = async (id) => {
  const berracoRemovido = await prisma.berraco_Removido.findUnique({
    where: { id: id },
  });

  if (!berracoRemovido) {
    throw new Error("Berraco Removido not found.");
  }

  const [deleteBerracoRemovido, ..._] = await prisma.$transaction([
    prisma.berraco_Removido.delete({ where: { id: id } }),
    prisma.berraco.update({
      where: { id: berracoRemovido.berraco_id },
      data: {
        condicion: berracoRemovido.condicion_anterior,
        activo: true,
      },
    }),
  ]);
  return deleteBerracoRemovido;
};
