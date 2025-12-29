import prisma from "../prismaClient.js";
import { AppError } from "../errors/appError.js";

const condicionesValidas = ["destetada", "viva", "aborto"];

export const createServicio = async (data, granja_id) => {
  const { cerda_id, jaula_id, observacion, montas } = data;

  const cerda = await validateCerda(cerda_id, granja_id);
  await validateJaula(jaula_id, granja_id);
  await validateBerracos(montas, granja_id);
  await validateOperarios(montas, granja_id);

  const [servicio, ..._] = await prisma.$transaction([
    prisma.servicio.create({
      data: {
        cerda: { connect: { id: cerda_id } },
        jaula: { connect: { id: jaula_id } },
        granja: { connect: { id: granja_id } },
        observacion,
        montas: {
          create: montas.map((monta) => ({
            fecha: monta.fecha,
            berraco: { connect: { id: monta.berraco_id } },
            operario: { connect: { id: monta.operario_id } },
            granja: { connect: { id: granja_id } },
            turno: monta.turno,
            observacion: monta.observacion,
          })),
        },
      },
    }),
    prisma.cerda.update({
      where: { id: cerda_id },
      data: { condicion: "gestando" },
    }),
    prisma.jaula.update({
      where: { id: cerda.jaula_id },
      data: { disponible: true },
    }),
    prisma.jaula.update({
      where: { id: jaula_id },
      data: { disponible: false },
    }),
  ]);
  return servicio;
};

export const updateServicio = async (id, granja_id, data) => {
  const { jaula_id, observacion, montas } = data;
  const servicioUpdateData = {};

  const servicio = await validateServicio(id, granja_id);

  if (observacion !== undefined) {
    servicioUpdateData.observacion = observacion;
  }

  if (montas !== undefined && Array.isArray(montas)) {
    await validateBerracos(montas, granja_id);
    await validateOperarios(montas, granja_id);

    servicioUpdateData.montas = {
      deleteMany: { servicio_id: id },
      create: montas.map((monta) => ({
        fecha: monta.fecha,
        berraco: { connect: { id: monta.berraco_id } },
        operario: { connect: { id: monta.operario_id } },
        granja: { connect: { id: monta.granja_id } },
        turno: monta.turno,
        observacion: monta.observacion,
      })),
    };
  }

  if (jaula_id !== undefined) {
    await validateJaula(jaula_id, granja_id);

    servicioUpdateData.jaula = { connect: { id: jaula_id } };

    const [updatedServicio, ..._] = await prisma.$transaction([
      prisma.servicio.update({ where: { id }, data: servicioUpdateData }),
      prisma.jaula.update({
        where: { id: servicio.jaula_id },
        data: { disponible: true },
      }),
      prisma.jaula.update({
        where: { id: jaula_id },
        data: { disponible: false },
      }),
      prisma.cerda.update({
        where: { id: servicio.cerda_id },
        data: { jaula: { connect: { id: jaula_id } } },
      }),
    ]);
    return updatedServicio;
  } else {
    const updatedServicio = await prisma.servicio.update({
      where: { id },
      data: servicioUpdateData,
    });
    return updatedServicio;
  }
};

export const getServicioById = async (id, granja_id) => {
  return prisma.servicio.findFirst({
    where: { id, granja_id },
    include: { montas: true },
  });
};

export const listServicios = async (granja_id) => {
  return prisma.servicio.findMany({
    where: { granja_id },
    include: { montas: true },
  });
};

export const deleteServicio = async (id, granja_id) => {
  const servicio = await validateServicio(id, granja_id);

  const [deletedServicio, ..._] = await prisma.$transaction([
    prisma.servicio.delete({ where: { id } }),
    prisma.cerda.update({
      where: { id: servicio.cerda_id },
      data: { condicion: servicio.condicion_anterior, jaula_id: null },
    }),
    prisma.jaula.update({
      where: { id: servicio.jaula_id },
      data: { disponible: true },
    }),
  ]);
  return deletedServicio;
};

const validateCerda = async (cerda_id, granja_id) => {
  const cerda = await prisma.cerda.findFirst({
    where: { id: cerda_id, granja_id, activo: true },
  });
  if (!cerda) {
    throw new AppError("CERDA_NOT_FOUND", 404);
  }
  if (!condicionesValidas.includes(cerda.condicion)) {
    throw new AppError("CERDA_CONDICION_INVALIDA", 400);
  }
  return cerda;
};

const validateJaula = async (jaula_id, granja_id) => {
  const jaula = await prisma.jaula.findFirst({
    where: { id: jaula_id, granja_id, activo: true },
  });
  if (!jaula) {
    throw new AppError("JAULA_NOT_FOUND", 404);
  }
  if (!jaula.disponible) {
    throw new AppError("JAULA_NOT_AVAILABLE", 400);
  }
  return jaula;
};

const validateBerracos = async (montas, granja_id) => {
  for (const monta of montas) {
    const berraco = await prisma.berraco.findFirst({
      where: { id: monta.berraco_id, granja_id, activo: true },
    });
    if (!berraco) {
      throw new AppError("BERRACO_NOT_FOUND", 404);
    }
  }
};

const validateOperarios = async (montas, granja_id) => {
  for (const monta of montas) {
    const operario = await prisma.operario.findFirst({
      where: { id: monta.operario_id, granja_id, activo: true },
    });
    if (!operario) {
      throw new AppError("OPERARIO_NOT_FOUND", 404);
    }
  }
};

const validateServicio = async (servicio_id, granja_id) => {
  const servicio = await prisma.servicio.findFirst({
    where: { id: servicio_id, granja_id },
  });
  if (!servicio) {
    throw new AppError("SERVICIO_NOT_FOUND", 404);
  }
  return servicio;
};
