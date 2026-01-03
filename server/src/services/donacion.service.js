import prisma from "../prismaClient.js";
import { AppError } from "../errors/appError.js";

export const createDonacion = async (data, granja_id) => {
  const { fecha, cantidad, peso, cerda_id } = data;

  const cerda = await validateCerdaExist(cerda_id, granja_id);
  validateDateDonacion(fecha, cerda.partos[0], cerda.destetes[0] || null);

  const donacion = await prisma.donacion.create({
    data: {
      fecha,
      cantidad,
      peso,
      cerda: { connect: { id: cerda_id } },
      granja: { connect: { id: granja_id } },
      paridera: { connect: { id: cerda.paridera_id } },
      parto: { connect: { id: cerda.partos[0].id } },
    },
  });
  return donacion;
};

export const listDonaciones = async (granja_id) => {
  const donaciones = await prisma.donacion.findMany({
    where: { granja_id },
  });
  return donaciones;
};

export const getDonacionById = async (id, granja_id) => {
  const donacion = await prisma.donacion.findFirst({
    where: { id, granja_id },
  });
  return donacion;
};

export const updateDonacion = async (id, granja_id, data) => {
  const { fecha, cantidad, peso } = data;
  const dataToUpdate = {};

  const donacion = await validateDonacionExists(id, granja_id);
  const cerda = await validateCerdaExist(donacion.cerda_id, granja_id);

  if (fecha !== undefined) {
    validateDateDonacion(
      new Date(fecha),
      cerda.partos[0],
      cerda.destetes[0] || null
    );
    dataToUpdate.fecha = fecha;
  }
  if (cantidad !== undefined) dataToUpdate.cantidad = cantidad;
  if (peso !== undefined) dataToUpdate.peso = peso;

  const updatedDonacion = await prisma.donacion.update({
    where: { id },
    data: dataToUpdate,
  });
  return updatedDonacion;
};

export const deleteDonacion = async (id, granja_id) => {
  const donacion = await validateDonacionExists(id, granja_id);
  const cerda = await validateCerdaExist(donacion.cerda_id, granja_id);

  if (cerda.destetes.length > 0) {
    const ultimoDestete = cerda.destetes[0];
    if (donacion.fecha > ultimoDestete.fecha) {
      throw new AppError("CANNOT_DELETE_DONACION_AFTER_DESTETE", 400);
    }
  }

  const deletedDonacion = await prisma.donacion.delete({
    where: { id },
  });
  return deletedDonacion;
};

const validateCerdaExist = async (cerda_id, granja_id) => {
  const cerda = await prisma.cerda.findFirst({
    where: {
      id: cerda_id,
      granja_id,
      activo: true,
    },
    include: {
      partos: {
        take: 1,
        orderBy: { fecha: "desc" },
      },
      destetes: {
        take: 1,
        orderBy: { fecha: "desc" },
      },
    },
  });
  if (!cerda) {
    throw new AppError("CERDA_NOT_FOUND", 404);
  }
  if (cerda.condicion !== "lactando") {
    throw new AppError("CERDA_NOT_LACTANDO", 400);
  }
  if (cerda.partos.length === 0) {
    throw new AppError("CERDA_HAS_NOT_PARTOS", 400);
  }
  if (cerda.paridera_id === null) {
    throw new AppError("CERDA_NOT_ASSIGNED_PARIDERA", 400);
  }
  return cerda;
};

const validateDateDonacion = (fechaDonacion, ultimoParto, ultimoDestete) => {
  const fechaParto = new Date(ultimoParto.fecha);
  fechaParto.setHours(0, 0, 0, 0);
  fechaDonacion.setHours(0, 0, 0, 0);
  if (fechaDonacion < fechaParto) {
    throw new AppError("DONACION_DATE_BEFORE_PARTO", 400);
  }
  if (ultimoDestete) {
    const fechaDestete = new Date(ultimoDestete.fecha);
    fechaDestete.setHours(0, 0, 0, 0);
    if (fechaDonacion > fechaDestete) {
      throw new AppError("DONACION_DATE_AFTER_DESTETE", 400);
    }
  }
};

const validateDonacionExists = async (id, granja_id) => {
  const donacion = await prisma.donacion.findFirst({
    where: { id, granja_id },
  });
  if (!donacion) {
    throw new AppError("DONACION_NOT_FOUND", 404);
  }
  return donacion;
};
