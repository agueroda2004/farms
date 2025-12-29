import prisma from "../prismaClient.js";
import { AppError } from "../errors/appError.js";

export const createParto = async (data, granja_id) => {
  const {
    cerda_id,
    vivos,
    muertos,
    momias,
    peso,
    paridera_id,
    turno,
    fecha,
    hora_inicio,
    hora_final,
    duracion,
    manipulada,
    observacion,
    vacunas,
    operarios,
  } = data;

  const servicio = await validateServicio(cerda_id, granja_id, fecha);

  validateDateParto(fecha, servicio);

  await validateCerda(cerda_id, granja_id);
  await validateParidera(paridera_id, granja_id);
  await validateOperarios(operarios || [], granja_id);
  await validateVacunas(vacunas || [], granja_id);

  const [parto] = await prisma.$transaction([
    prisma.parto.create({
      data: {
        cerda: { connect: { id: Number(cerda_id) } },
        nacidos_vivos: Number(vivos),
        nacidos_muertos: Number(muertos),
        nacidos_momias: Number(momias),
        peso: Number(peso),
        paridera: { connect: { id: Number(paridera_id) } },
        turno,
        fecha,
        hora_inicio,
        hora_final,
        duracion,
        manipulada,
        observacion,
        granja: { connect: { id: Number(granja_id) } },

        operarios:
          operarios && operarios.length > 0
            ? {
                connect: operarios.map((id) => ({ id: Number(id) })),
              }
            : undefined,

        vacunas:
          vacunas && vacunas.length > 0
            ? {
                connect: vacunas.map((id) => ({ id: Number(id) })),
              }
            : undefined,
      },
    }),
    prisma.cerda.update({
      where: { id: Number(cerda_id), granja_id: Number(granja_id) },
      data: { condicion: "lactando" },
    }),
    prisma.paridera.update({
      where: { id: Number(paridera_id), granja_id: Number(granja_id) },
      data: { disponible: false },
    }),
    servicio.cerda.jaula_id &&
      prisma.jaula.update({
        where: { id: servicio.cerda.jaula_id, granja_id: Number(granja_id) },
        data: { disponible: true },
      }),
  ]);

  return parto;
};

export const updateParto = async (id, granja_id, data) => {
  const {
    vivos,
    muertos,
    momias,
    peso,
    paridera_id,
    turno,
    fecha,
    hora_inicio,
    hora_final,
    duracion,
    manipulada,
    observacion,
    vacunas,
    operarios,
  } = data;
  const dataToUpdate = {};

  const currentParto = await validateParto(id, granja_id);

  if (fecha !== undefined) {
    const servicio = await validateServicio(currentParto.cerda_id, granja_id);
    validateDateParto(fecha, servicio);
    dataToUpdate.fecha = fecha;
  }

  if (vivos !== undefined) dataToUpdate.nacidos_vivos = vivos;
  if (muertos !== undefined) dataToUpdate.nacidos_muertos = muertos;
  if (momias !== undefined) dataToUpdate.nacidos_momias = momias;
  if (peso !== undefined) dataToUpdate.peso = peso;
  if (turno !== undefined) dataToUpdate.turno = turno;
  if (hora_inicio !== undefined) dataToUpdate.hora_inicio = hora_inicio;
  if (hora_final !== undefined) dataToUpdate.hora_final = hora_final;
  if (manipulada !== undefined) dataToUpdate.manipulada = manipulada;
  if (observacion !== undefined) dataToUpdate.observacion = observacion;
  if (duracion !== undefined) dataToUpdate.duracion = duracion;

  if (operarios !== undefined) {
    await validateOperarios(operarios, granja_id);
    dataToUpdate.operarios = {
      set: operarios.map((opId) => ({ id: Number(opId) })),
    };
  }
  if (vacunas !== undefined) {
    await validateVacunas(vacunas, granja_id);
    dataToUpdate.vacunas = {
      set: vacunas.map((vacId) => ({ id: Number(vacId) })),
    };
  }

  if (paridera_id !== undefined) {
    await validateParidera(paridera_id, granja_id);

    dataToUpdate.paridera = { connect: { id: Number(paridera_id) } };

    const [updatedParto] = await prisma.$transaction([
      prisma.parto.update({ where: { id: Number(id) }, data: dataToUpdate }),
      prisma.paridera.update({
        where: { id: Number(paridera_id) },
        data: { disponible: false },
      }),
      prisma.paridera.update({
        where: { id: Number(currentParto.paridera_id) },
        data: { disponible: true },
      }),
    ]);
    return updatedParto;
  } else {
    const updatedParto = await prisma.parto.update({
      where: { id: Number(id) },
      data: dataToUpdate,
    });
    return updatedParto;
  }
};

export const getPartoById = async (id, granja_id) => {
  return await prisma.parto.findFirst({
    where: { id: Number(id), granja_id: Number(granja_id) },
  });
};

export const listPartos = async (granja_id) => {
  return await prisma.parto.findMany({
    where: { granja_id },
  });
};

export const deleteParto = async (id, granja_id) => {
  const parto = await validateParto(id, granja_id, true);

  const hasRecords =
    (parto.adopciones && parto.adopciones.length > 0) ||
    (parto.donaciones && parto.donaciones.length > 0) ||
    (parto.muertos && parto.muertos.length > 0) ||
    (parto.destetes && parto.destetes.length > 0);

  if (hasRecords) {
    throw new AppError("PARTO_CANNOT_DELETE_HAS_RECORDS", 400);
  }

  const [deleteParto, ..._] = await prisma.$transaction([
    prisma.parto.delete({
      where: { id: Number(id), granja_id: Number(granja_id) },
    }),
    prisma.paridera.update({
      where: { id: parto.paridera_id, granja_id: Number(granja_id) },
      data: { disponible: true },
    }),
    prisma.cerda.update({
      where: { id: parto.cerda_id, granja_id: Number(granja_id) },
      data: { condicion: "gestando", paridera_id: null },
    }),
  ]);

  return deleteParto;
};

const validateServicio = async (cerda_id, granja_id, fecha) => {
  const servicio = await prisma.servicio.findFirst({
    where: { cerda_id: Number(cerda_id), granja_id: Number(granja_id) },
    orderBy: { id: "desc" },
    include: {
      montas: {
        orderBy: { fecha: "asc" },
        take: 1,
      },
    },
  });

  if (!servicio || servicio.montas.length === 0) {
    throw new AppError("SERVICIO_NOT_FOUND", 400);
  }

  return servicio;
};

const validateDateParto = (fecha, servicio) => {
  const fechaMonta = servicio.montas[0].fecha;
  const fechaParto = new Date(fecha);

  const diffTiempo = fechaParto.getTime() - fechaMonta.getTime();
  const diffDias = diffTiempo / (1000 * 3600 * 24);

  if (diffDias < 110) {
    throw new AppError("PARTO_LESS_THAN_110_DAYS", 400);
  }
};

const validateCerda = async (cerda_id, granja_id) => {
  const cerda = await prisma.cerda.findFirst({
    where: {
      id: Number(cerda_id),
      granja_id: Number(granja_id),
      activo: true,
    },
  });
  if (!cerda) {
    throw new AppError("CERDA_NOT_FOUND", 400);
  }
  if (cerda.condicion !== "gestando") {
    throw new AppError("CERDA_NOT_GESTANDO", 400);
  }
  return cerda;
};

const validateParidera = async (paridera_id, granja_id) => {
  const paridera = await prisma.paridera.findFirst({
    where: {
      id: Number(paridera_id),
      granja_id: Number(granja_id),
      activo: true,
    },
  });
  if (!paridera) {
    throw new AppError("PARIDERA_NOT_FOUND", 400);
  }
  if (!paridera.disponible) {
    throw new AppError("PARIDERA_NOT_AVAILABLE", 400);
  }
  return paridera;
};

const validateVacunas = async (vacunas, granja_id) => {
  if (vacunas.length === 0) return;

  const count = await prisma.vacuna.count({
    where: {
      id: { in: vacunas.map(Number) },
      granja_id: Number(granja_id),
      activo: true,
    },
  });

  if (count !== vacunas.length) {
    throw new AppError("VACUNA_NOT_FOUND", 400);
  }
};

const validateOperarios = async (operarios, granja_id) => {
  if (operarios.length === 0) return;

  const count = await prisma.operario.count({
    where: {
      id: { in: operarios.map(Number) },
      granja_id: Number(granja_id),
      activo: true,
    },
  });

  if (count !== operarios.length) {
    throw new AppError("OPERARIO_NOT_FOUND", 400);
  }
};

const validateParto = async (parto_id, granja_id, withExtension = false) => {
  const parto = await prisma.parto.findFirst({
    where: { id: parto_id, granja_id },
    include: withExtension
      ? {
          adopciones: {
            take: 1,
            orderBy: { fecha: "desc" },
          },
          donaciones: {
            take: 1,
            orderBy: { fecha: "desc" },
          },
          muertos: {
            take: 1,
            orderBy: { fecha: "desc" },
          },
          destetes: {
            take: 1,
            orderBy: { fecha: "desc" },
          },
        }
      : undefined,
  });
  if (!parto) {
    throw new AppError("PARTO_NOT_FOUND", 404);
  }
  return parto;
};
