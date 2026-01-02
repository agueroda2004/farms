import prisma from "../prismaClient.js";
import { AppError } from "../errors/appError.js";

export const createAdopcion = async (data, granja_id) => {
  const { fecha, cantidad, peso, cerda_id } = data;

  const cerda = await validateCerdaExist(cerda_id, granja_id, true);
  validateDateAdopcion(fecha, cerda.partos[0], cerda.destetes[0] || null);

  const adopcion = await prisma.adopcion.create({
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
  return adopcion;
};

export const listAdopciones = async (granja_id) => {
  const adopciones = await prisma.adopcion.findMany({
    where: { granja_id },
  });
  return adopciones;
};

export const getAdopcionById = async (id, granja_id) => {
  const adopcion = await prisma.adopcion.findFirst({
    where: { id, granja_id },
  });
  return adopcion;
};

export const updateAdopcion = async (id, granja_id, data) => {
  const { fecha, cantidad, peso } = data;
  const dataToUpdate = {};

  const adopcion = await validateAdoptionExists(id, granja_id);
  const cerda = await validateCerdaExist(adopcion.cerda_id, granja_id);

  if (fecha !== undefined) {
    validateDateAdopcion(
      new Date(fecha),
      cerda.partos[0],
      cerda.destetes[0] || null
    );
    dataToUpdate.fecha = fecha;
  }

  if (cantidad !== undefined) dataToUpdate.cantidad = cantidad;
  if (peso !== undefined) dataToUpdate.peso = peso;

  const updatedAdopcion = await prisma.adopcion.update({
    where: { id },
    data: dataToUpdate,
  });
  return updatedAdopcion;
};

export const deleteAdopcion = async (id, granja_id) => {
  const adopcion = await validateAdoptionExists(id, granja_id);
  const cerda = await validateCerdaExist(adopcion.cerda_id, granja_id);

  if (cerda.destetes.length > 0) {
    const ultimoDestete = cerda.destetes[0];
    if (adopcion.fecha > ultimoDestete.fecha) {
      throw new AppError("CANNOT_DELETE_ADOPCION_AFTER_DESTETE_EXISTS", 400);
    }
  }

  const deletedAdopcion = await prisma.adopcion.delete({
    where: { id },
  });
  return deletedAdopcion;
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

const validateDateAdopcion = (fechaAdopcion, ultimoParto, ultimoDestete) => {
  const fechaParto = new Date(ultimoParto.fecha);
  fechaParto.setHours(0, 0, 0, 0);
  fechaAdopcion.setHours(0, 0, 0, 0);
  if (fechaAdopcion < fechaParto) {
    throw new AppError("ADOPCION_DATE_BEFORE_PARTO", 400);
  }
  if (ultimoDestete) {
    const fechaDestete = new Date(ultimoDestete.fecha);
    fechaDestete.setHours(0, 0, 0, 0);
    if (fechaAdopcion > fechaDestete) {
      throw new AppError("ADOPCION_DATE_AFTER_DESTETE", 400);
    }
  }
};

const validateAdoptionExists = async (id, granja_id) => {
  const adopcion = await prisma.adopcion.findFirst({
    where: { id, granja_id },
  });
  if (!adopcion) {
    throw new AppError("ADOPCION_NOT_FOUND", 404);
  }
  return adopcion;
};
