import prisma from "../prismaClient.js";
import { AppError } from "../errors/appError.js";

export const createDestete = async (data, granja_id) => {
  const { fecha, cantidad, peso, parcial, cerda_id } = data;

  const cerda = await validateCerdaExist(cerda_id, granja_id);
  validateDateDestete(cerda.partos[0], fecha);
  validateCantidadCerdos(cerda.partos[0], cantidad);

  const desteteData = {
    fecha,
    cantidad,
    peso,
    parcial,
    cerda: { connect: { id: cerda_id } },
    granja: { connect: { id: granja_id } },
    paridera: { connect: { id: cerda.paridera_id } },
    parto: { connect: { id: ultimoParto.id } },
  };

  if (!parcial) {
    const [destete, ..._] = await prisma.$transaction([
      prisma.destete.create({ data: desteteData }),
      prisma.cerda.update({
        where: { id: cerda_id },
        data: { condicion: "destetada", paridera_id: null },
      }),
      prisma.paridera.update({
        where: { id: cerda.paridera_id },
        data: { disponible: true },
      }),
    ]);
    return destete;
  } else {
    const destete = await prisma.destete.create({ data: desteteData });
    return destete;
  }
};

export const listDestetes = async (granja_id) => {
  const destetes = await prisma.destete.findMany({
    where: { granja_id },
  });
  return destetes;
};

export const getDesteteById = async (id, granja_id) => {
  const destete = await prisma.destete.findFirst({
    where: { id, granja_id },
  });
  return destete;
};

export const updateDestete = async (id, granja_id, data) => {
  const { fecha, cantidad, peso, parcial } = data;
  const dataToUpdate = {};

  const destete = await validateDesteteExist(id, granja_id);
  const cerda = await validateCerdaExist(destete.cerda_id, granja_id);

  if (fecha !== undefined) {
    validateDateDestete(cerda.partos[0], fecha);
    dataToUpdate.fecha = fecha;
  }

  if (cantidad !== undefined) {
    validateCantidadCerdos(cerda.partos[0], cantidad);
    dataToUpdate.cantidad = cantidad;
  }

  if (peso !== undefined) dataToUpdate.peso = peso;

  if (parcial !== undefined) {
    dataToUpdate.parcial = parcial;
    if (parcial === false) {
      const [updatedDestete, ..._] = await prisma.$transaction([
        prisma.destete.update({
          where: { id },
          data: dataToUpdate,
        }),
        prisma.cerda.update({
          where: { id: cerda.id },
          data: { condicion: "destetada", paridera_id: null },
        }),
        prisma.paridera.update({
          where: { id: cerda.paridera_id },
          data: { disponible: true },
        }),
      ]);
      return updatedDestete;
    }
    if (parcial === true) {
      const [updatedDestete, ..._] = await prisma.$transaction([
        prisma.destete.update({
          where: { id },
          data: dataToUpdate,
        }),
        prisma.cerda.update({
          where: { id: cerda.id },
          data: { condicion: "lactando", paridera_id: null },
        }),
      ]);
      return updatedDestete;
    }
  }
  const updatedDestete = await prisma.destete.update({
    where: { id },
    data: dataToUpdate,
  });
  return updatedDestete;
};

export const deleteDestete = async (id, granja_id) => {
  const destete = await validateDesteteExist(id, granja_id);
  const cerda = await validateCerdaExist(destete.cerda_id, granja_id);

  const ultimoParto = cerda.partos[0];

  const fechaDesteteValidacion = new Date(fecha);

  if (destete.parcial === false) {
    const fechaMontaValidacion = cerda.servicios.length
      ? new Date(cerda.servicios[0].montas[0].fecha)
      : null;
    if (fechaMontaValidacion && fechaMontaValidacion > fechaDesteteValidacion) {
      throw new AppError("CANNOT_DELETE_DESTETE_BEFORE_MATING", 400);
    }
    const [deletedDestete, ..._] = await prisma.$transaction([
      prisma.destete.delete({ where: { id } }),
      prisma.cerda.update({
        where: { id: cerda.id },
        data: {
          condicion: "lactando",
          paridera_id: null,
        },
      }),
    ]);
    return deletedDestete;
  }
  if (destete.parcial === true) {
    validateDeleteDate(ultimoParto, destete.fecha);
    const deletedDestete = await prisma.$transaction([
      prisma.destete.delete({ where: { id } }),
      prisma.cerda.update({
        where: { id: cerda.id },
        data: { condicion: "lactando", paridera_id: null },
      }),
    ]);
    return deletedDestete;
  }
};

const validateCerdaExist = async (cerda_id, granja_id) => {
  const cerda = await prisma.cerda.findFirst({
    where: { id: cerda_id, granja_id },
    include: {
      partos: {
        take: 1,
        orderBy: { fecha: "desc" },
        include: {
          muertos: {
            where: {
              fecha: { gte: new Date("1900-01-01"), lte: new Date(fecha) },
            },
            orderBy: { fecha: "desc" },
          },
          adopciones: {
            where: {
              fecha: { gte: new Date("1900-01-01"), lte: new Date(fecha) },
            },
            orderBy: { fecha: "desc" },
          },
          donaciones: {
            where: {
              fecha: { gte: new Date("1900-01-01"), lte: new Date(fecha) },
            },
            orderBy: { fecha: "desc" },
          },
          destetes: {
            where: { parcial: true },
            orderBy: { fecha: "desc" },
          },
        },
      },
    },
  });
  if (!cerda) {
    throw new AppError("CERDA_NOT_FOUND", 404);
  }
  if (cerda.partos.length === 0) {
    throw new AppError("CERDA_HAS_NOT_PARTOS", 400);
  }
  if (cerda.paridera_id === null) {
    throw new AppError("CERDA_NOT_ASSIGNED_PARIDERA", 400);
  }
  if (cerda.condicion !== "lactando") {
    throw new AppError("CERDA_NOT_LACTANDO", 400);
  }
  return cerda;
};

const validateDateDestete = (ultimoParto, fecha) => {
  const fechaDesteteValidacion = new Date(fecha);
  const fechaPartoValidacion = new Date(ultimoParto.fecha);
  const fechaMuertosValidacion = ultimoParto.muertos.length
    ? new Date(ultimoParto.muertos[0].fecha)
    : null;
  const fechaAdopcionesValidacion = ultimoParto.adopciones.length
    ? new Date(ultimoParto.adopciones[0].fecha)
    : null;
  const fechaDonacionesValidacion = ultimoParto.donaciones.length
    ? new Date(ultimoParto.donaciones[0].fecha)
    : null;
  const fechaDestetesParcialesValidacion = ultimoParto.destetes.length
    ? new Date(ultimoParto.destetes[0].fecha)
    : null;

  if (fechaDesteteValidacion < fechaPartoValidacion) {
    throw new AppError("CANNOT_DESTETE_BEDORE_PARTO", 400);
  }
  if (
    fechaMuertosValidacion &&
    fechaMuertosValidacion > fechaDesteteValidacion
  ) {
    throw new AppError("CANNOT_DESTETE_BEFORE_LAST_MUERTE_PRE_DESTETE", 400);
  }

  if (
    fechaAdopcionesValidacion &&
    fechaAdopcionesValidacion > fechaDesteteValidacion
  ) {
    throw new AppError("CANNOT_DESTETE_BEFORE_LAST_ADOPCION", 400);
  }
  if (
    fechaDonacionesValidacion &&
    fechaDonacionesValidacion > fechaDesteteValidacion
  ) {
    throw new AppError("CANNOT_DESTETE_BEFORE_LAST_DONACION", 400);
  }
  if (
    fechaDestetesParcialesValidacion &&
    fechaDestetesParcialesValidacion > fechaDesteteValidacion
  ) {
    throw new AppError("CANNOT_DESTETE_BEFORE_LAST_DESTETE_PARCIAL", 400);
  }
};

const validateCantidadCerdos = (ultimoParto, cantidad) => {
  const totalMuertos = ultimoParto.muertos.reduce(
    (sum, m) => sum + m.cantidad,
    0
  );
  const totalAdopciones = ultimoParto.adopciones.reduce(
    (sum, a) => sum + a.cantidad,
    0
  );
  const totalDonaciones = ultimoParto.donaciones.reduce(
    (sum, d) => sum + d.cantidad,
    0
  );
  const lechonesEsperados =
    ultimoParto.nacidos_vivos -
    totalDonaciones -
    totalMuertos +
    totalAdopciones;

  if (cantidad > lechonesEsperados) {
    throw new AppError("QUANTITY_EXCEEDS_LITTER_SIZE", 400);
  }

  if (cantidad < lechonesEsperados) {
    throw new AppError("QUANTITY_LESS_THAN_LITTER_SIZE", 400);
  }
};

const validateDesteteExist = async (id, granja_id) => {
  const destete = await prisma.destete.findFirst({
    where: { id, granja_id },
  });
  if (!destete) {
    throw new AppError("DESTETE_NOT_FOUND", 404);
  }
  return destete;
};

const validateDeleteDate = (ultimoParto, fechaDestete) => {
  const fechaDesteteValidacion = new Date(fechaDestete);
  const fechaMuertosValidacion = ultimoParto.muertos.length
    ? new Date(ultimoParto.muertos[0].fecha)
    : null;
  const fechaAdopcionesValidacion = ultimoParto.adopciones.length
    ? new Date(ultimoParto.adopciones[0].fecha)
    : null;
  const fechaDonacionesValidacion = ultimoParto.donaciones.length
    ? new Date(ultimoParto.donaciones[0].fecha)
    : null;
  const fechaDestetesParcialesValidacion = ultimoParto.destetes.length
    ? new Date(ultimoParto.destetes[0].fecha)
    : null;

  if (
    fechaMuertosValidacion &&
    fechaMuertosValidacion > fechaDesteteValidacion
  ) {
    throw new AppError("CANNOT_DELETE_DESTETE_AFTER_MUERTE_PRE_DESTETE", 400);
  }
  if (
    fechaAdopcionesValidacion &&
    fechaAdopcionesValidacion > fechaDesteteValidacion
  ) {
    throw new AppError("CANNOT_DELETE_DESTETE_AFTER_ADOPTION", 400);
  }
  if (
    fechaDonacionesValidacion &&
    fechaDonacionesValidacion > fechaDesteteValidacion
  ) {
    throw new AppError("CANNOT_DELETE_DESTETE_AFTER_DONATION", 400);
  }
};
