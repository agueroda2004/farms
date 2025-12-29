import { AppError } from "../errors/appError.js";
import prisma from "../prismaClient.js";

export const createCerda = async (data, granja_id) => {
  const { nombre, paridad, fecha_ingreso, observacion, raza_id, jaula_id } =
    data;

  await validateCerdaNameUnique(nombre, granja_id);
  await validateRazaExists(raza_id, granja_id);
  await validateJaula(jaula_id, granja_id);

  const cerda = await prisma.cerda.create({
    data: {
      nombre,
      paridad: Number(paridad),
      fecha_ingreso,
      observacion,
      raza: { connect: { id: Number(raza_id) } },
      jaula: { connect: { id: Number(jaula_id) } },
      granja: { connect: { id: Number(granja_id) } },
    },
  });

  return cerda;
};

export const listCerdas = async (granja_id) => {
  return await prisma.cerda.findMany({
    where: { granja_id: granja_id },
  });
};

export const getCerdaById = async (id, granja_id) => {
  const cerda = await validateCerdaExists(id, granja_id);
  return cerda;
};

export const updateCerda = async (id, granja_id, data) => {
  const {
    nombre,
    paridad,
    fecha_ingreso,
    activo,
    observacion,
    raza_id,
    jaula_id,
  } = data;
  const dataToUpdate = {};

  const cerda = await validateCerdaExists(id, granja_id);

  if (nombre !== undefined) {
    if (nombre !== cerda.nombre) {
      await validateCerdaNameUnique(nombre, granja_id);
    }

    dataToUpdate.nombre = nombre;
  }

  if (paridad !== undefined) dataToUpdate.paridad = Number(paridad);

  if (fecha_ingreso !== undefined) {
    await validateFechaIngreso(cerda.id, fecha_ingreso);
    dataToUpdate.fecha_ingreso = fecha_ingreso;
  }

  if (activo !== undefined) dataToUpdate.activo = activo;

  if (observacion !== undefined) dataToUpdate.observacion = observacion;

  if (raza_id !== undefined) {
    await validateRazaExists(raza_id, granja_id);
    dataToUpdate.raza = { connect: { id: Number(raza_id) } };
  }

  if (jaula_id !== undefined) {
    await validateJaula(jaula_id, granja_id);
    dataToUpdate.jaula = { connect: { id: Number(jaula_id) } };
  }

  return await prisma.cerda.update({ where: { id: id }, data: dataToUpdate });
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

const validateCerdaNameUnique = async (nombre, granja_id) => {
  const cerda = await prisma.cerda.findFirst({
    where: { nombre: nombre, granja_id: granja_id, activo: true },
  });

  if (cerda) {
    throw new AppError("CERDA_ID_EXISTS", 400);
  }
};

const validateRazaExists = async (id, granja_id) => {
  const raza = await prisma.raza.findFirst({
    where: { id: id, granja_id: granja_id },
  });
  if (!raza) {
    throw new AppError("RAZA_NOT_FOUND", 404);
  }
  return raza;
};

const validateJaula = async (id, granja_id) => {
  const jaula = await prisma.jaula.findFirst({
    where: { id: id, granja_id: granja_id },
  });
  if (!jaula) {
    throw new AppError("JAULA_NOT_FOUND", 404);
  }
  if (!jaula.disponible) {
    throw new AppError("JAULA_NOT_AVAILABLE", 400);
  }
  return jaula;
};

const validateFechaIngreso = async (cerda_id, fecha_ingreso) => {
  const ultimaMonta = await prisma.monta.findFirst({
    where: { cerda_id },
    orderBy: { fecha: "desc" },
  });

  const desecho = await prisma.cerda_Removida.findFirst({
    where: { cerda_id },
  });

  if (ultimaMonta && fecha_ingreso >= ultimaMonta.fecha) {
    throw new AppError("CERDA_FECHA_INGRESO_INVALIDA", 400);
  }
  if (desecho && fecha_ingreso >= desecho.fecha_removida) {
    throw new AppError("CERDA_FECHA_INGRESO_INVALIDA", 400);
  }
};
