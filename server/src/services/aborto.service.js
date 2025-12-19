import prisma from "../prismaClient";

export const createAborto = async (data) => {
  const { fecha, hora, observacion, cerda_id, granja_id } = data;

  const cerda = await prisma.cerda.findUnique({
    where: { id: cerda_id },
  });

  if (!cerda) {
    throw new Error("Cerda not found.");
  }

  if (cerda.condicion != "gestando") {
    throw new Error("Cerda is not in gestating condition.");
  }

  await validarFechaPorServicio(cerda_id, fecha);

  const [aborto, ..._] = await prisma.$transaction([
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
  return aborto;
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
  const { fecha, hora, observacion } = data;
  const dataToUpdate = {};

  const aborto = await prisma.aborto.findUnique({
    where: { id: id },
  });

  if (!aborto) {
    throw new Error("Aborto not found.");
  }

  if (fecha !== undefined) {
    await validarFechaPorServicio(aborto.cerda_id, fecha);
    dataToUpdate.fecha = fecha;
  }
  if (hora !== undefined) {
    dataToUpdate.hora = hora;
  }
  if (observacion !== undefined) {
    dataToUpdate.observacion = observacion;
  }

  return await prisma.aborto.update({ where: { id: id }, data: dataToUpdate });
};

export const deleteAborto = async (id) => {
  const { id } = data;
  const aborto = await prisma.aborto.findUnique({
    where: { id: id },
  });

  if (!aborto) {
    throw new Error("Aborto not found.");
  }

  const [deleteAborto, ..._] = await prisma.$transaction([
    prisma.aborto.delete({ where: { id: id } }),
    prisma.cerda.update({
      where: { id: aborto.cerda_id },
      data: {
        estado: aborto.condicion_anterior,
      },
    }),
  ]);

  return deleteAborto;
};

const validarFechaPorServicio = async (cerda_id, fecha) => {
  const servicio = await prisma.servicio.findFirst({
    where: {
      cerda_id: cerda_id,
    },
    include: { montas: true },
    orderBy: { fecha: "desc" },
  });

  if (!servicio) {
    throw new Error("No servicio found for this cerda.");
  }

  if (servicio.montas[0].fecha > fecha) {
    throw new Error(
      "The date cannot be earlier than your last 'servicio' date."
    );
  }
};
