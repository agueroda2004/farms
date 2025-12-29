import { AppError } from "../errors/appError.js";
import prisma from "../prismaClient.js";

export const createCerdaRemovida = async (granja_id, data) => {
  const { causa, observacion, fecha, cerda_id } = data;
  const transactions = [];

  const cerda = await validateCerdaExists(cerda_id, granja_id);

  await validateDateByCondition(cerda.condicion, cerda_id, fecha);

  const dataToCreate = {
    causa,
    observacion,
    fecha,
    granja: { connect: { id: granja_id } },
    cerda: { connect: { id: cerda_id } },
    condicion_anterior: cerda.condicion,
  };

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

  const [cerdaRemovida] = await prisma.$transaction([
    prisma.cerda_Removida.create({ data: dataToCreate }),
    ...transactions,
  ]);

  return cerdaRemovida;
};

export const listCerdasRemovidas = async (granja_id) => {
  return await prisma.cerda_Removida.findMany({ where: { granja_id } });
};

export const getCerdaRemovidaById = async (id, granja_id) => {
  const cerdaRemovida = await validateCerdaRemovidaExists(id, granja_id);
  return cerdaRemovida;
};

export const updateCerdaRemovida = async (id, granja_id, data) => {
  const { causa, observacion, fecha } = data;
  const dataToUpdate = {};

  const cerdaRemovida = await validateCerdaRemovidaExists(id, granja_id);

  if (causa !== undefined) dataToUpdate.causa = causa;

  if (observacion !== undefined) dataToUpdate.observacion = observacion;

  if (fecha !== undefined) {
    await validateDateByCondition(
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

export const deleteCerdaRemovida = async (id, granja_id) => {
  const cerdaRemovida = await validateCerdaRemovidaExists(id, granja_id);

  const [deleteCerdaRemovida] = await prisma.$transaction([
    prisma.cerda_Removida.delete({ where: { id: id } }),
    prisma.cerda.update({
      where: { id: cerdaRemovida.cerda_id },
      data: {
        activo: true,
        condicion: cerdaRemovida.condicion_anterior,
        jaula_id: null,
        paridera_id: null,
      },
    }),
  ]);
  return deleteCerdaRemovida;
};

const validateCerdaExists = async (id, granja_id) => {
  const cerda = await prisma.cerda.findFirst({
    where: { id: id, granja_id: granja_id, activo: true },
  });
  if (!cerda) {
    throw new AppError("CERDA_NOT_FOUND", 404);
  }
  return cerda;
};

const validateDateByCondition = async (condicion, cerda_id, fecha) => {
  switch (condicion) {
    case "aborto":
      const aborto = await prisma.aborto.findFirst({
        where: { cerda_id: cerda_id },
      });
      if (aborto && aborto.fecha < fecha) {
        throw new AppError("CERDA_REMOVIDA_INVALID_DATE", 400);
      }
      break;
    case "lactando":
      const parto = await prisma.parto.findFirst({
        where: { cerda_id: cerda_id },
      });
      if (parto && parto.fecha > fecha) {
        throw new AppError("CERDA_REMOVIDA_INVALID_DATE", 400);
      }
      break;
    case "gestando":
      const ultimaMonta = await prisma.monta.findFirst({
        where: { cerda_id: cerda_id },
        orderBy: { fecha: "desc" },
      });

      if (ultimaMonta && ultimaMonta.fecha > fecha) {
        throw new AppError("CERDA_REMOVIDA_INVALID_DATE", 400);
      }
      break;
    case "destetada":
      const detete = await prisma.destete.findFirst({
        where: { cerda_id: cerda_id },
      });
      if (detete && detete.fecha > fecha) {
        throw new AppError("CERDA_REMOVIDA_INVALID_DATE", 400);
      }
      break;
  }
};

const validateCerdaRemovidaExists = async (id, granja_id) => {
  const cerdaRemovida = await prisma.cerda_Removida.findFirst({
    where: { id: id, granja_id: granja_id },
  });
  if (!cerdaRemovida) {
    throw new AppError("CERDA_REMOVIDA_NOT_FOUND", 404);
  }
  return cerdaRemovida;
};
