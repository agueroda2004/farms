import prisma from "../prismaClient.js";

export const createCerdaRemovida = async (data) => {
  const { causa, observacion, fecha, granja_id, cerda_id } = data;

  const cerda = await prisma.cerda.findUnique({
    where: { id: cerda_id, activo: true },
  });

  if (!cerda) {
    throw new Error("Cerda not found.");
  }

  if (!cerda.activo) {
    throw new Error("Cerda is already inactive.");
  }

  await validarFechaPorCondicion(cerda.condicion, cerda_id, fecha);

  const dataToCreate = {
    causa,
    observacion,
    fecha,
    granja: { connect: { id: granja_id } },
    cerda: { connect: { id: cerda_id } },
    condicion_anterior: cerda.condicion,
  };

  const updates = [];

  if (cerda.jaula_id) {
    updates.push(
      prisma.jaula.update({
        where: { id: cerda.jaula_id },
        data: { disponible: true },
      })
    );
  }

  if (cerda.paridera_id) {
    updates.push(
      prisma.paridera.update({
        where: { id: cerda.paridera_id },
        data: { disponible: true },
      })
    );
  }

  updates.push(
    prisma.cerda.update({
      where: { id: cerda.id },
      data: {
        jaula_id: null,
        paridera_id: null,
        activo: false,
        condicion: causa,
      },
    })
  );

  const [deleteCerda] = await prisma.$transaction([
    prisma.cerda_Removida.create({ data: dataToCreate }),
    ...updates,
  ]);

  return deleteCerda;
};

export const listCerdasRemovidas = async (granja_id) => {
  return await prisma.cerda_Removida.findMany({ where: { granja_id } });
};

export const getCerdaRemovidaById = async (id) => {
  return await prisma.cerda_Removida.findUnique({ where: { id } });
};

export const updateCerdaRemovida = async (id, data) => {
  const { causa, observacion, fecha } = data;
  const dataToUpdate = {};

  const cerdaRemovida = await prisma.cerda_Removida.findUnique({
    where: { id },
  });

  if (!cerdaRemovida) {
    throw new Error("Cerda Removida not found.");
  }

  if (causa !== undefined) dataToUpdate.causa = causa;
  if (observacion !== undefined) dataToUpdate.observacion = observacion;
  if (fecha !== undefined) {
    await validarFechaPorCondicion(
      cerdaRemovida.condicion_anterior,
      cerdaRemovida.cerda_id,
      fecha
    );
    dataToUpdate.fecha = fecha;
  }

  return await prisma.cerda_Removida.update({
    where: { id },
    data: dataToUpdate,
  });
};

export const deleteCerdaRemovida = async (id) => {
  const cerdaRemovida = await prisma.cerda_Removida.findUnique({
    where: { id: id },
  });

  if (!cerdaRemovida) {
    throw new Error("Cerda Removida not found.");
  }

  const [deleteCerdaRemovida] = await prisma.$transaction([
    prisma.cerda_Removida.delete({ where: { id: id } }),
    prisma.cerda.update({
      where: { id: cerdaRemovida.cerda_id },
      data: {
        activo: true,
        condicion: cerdaRemovida.condicion_anterior,
      },
    }),
  ]);
  return deleteCerdaRemovida;
};

const validarFechaPorCondicion = async (condicion, cerda_id, fecha) => {
  switch (condicion) {
    case "aborto":
      const aborto = await prisma.aborto.findFirst({
        where: { cerda_id: cerda_id, activo: true },
      });
      if (aborto && aborto.fecha < fecha) {
        throw new Error(
          "The date cannot be earlier than your last event 'aborto'"
        );
      }
      break;
    case "lactando":
      const parto = await prisma.parto.findFirst({
        where: { cerda_id: cerda_id, activo: true },
      });
      if (parto && parto.fecha > fecha) {
        throw new Error(
          "The date cannot be earlier than your last event 'parto'"
        );
      }
      break;
    case "gestando":
      const servicio = await prisma.servicio.findFirst({
        where: { cerda_id: cerda_id, activo: true },
        include: { montas: true },
      });
      const primeraMonta = servicio.montas[0];
      if (servicio && primeraMonta.fecha > fecha) {
        throw new Error(
          "The date cannot be earlier than your last event 'servicio'"
        );
      }
      break;
    case "destetada":
      const detete = await prisma.destete.findFirst({
        where: { cerda_id: cerda_id, activo: true },
      });
      if (detete && detete.fecha > fecha) {
        throw new Error(
          "The date cannot be earlier than your last event 'destete'"
        );
      }
      break;
  }
};
