import prisma from "../prismaClient.js";
import { AppError } from "../errors/appError.js";

export const createParidera = async (data, granja_id) => {
  const { nombre } = data;
  await validateParideraNameUnique(nombre, granja_id);

  const paridera = await prisma.paridera.create({
    data: {
      nombre,
      granja: { connect: { id: Number(granja_id) } },
    },
  });
  return paridera;
};

export const listParideras = async (granja_id) => {
  const parideras = await prisma.paridera.findMany({
    where: { granja_id: Number(granja_id) },
  });
  return parideras;
};

export const getParideraById = async (id, granja_id) => {
  const paridera = await prisma.paridera.findFirst({
    where: { id: Number(id), granja_id: Number(granja_id) },
  });
  return paridera;
};

export const updateParidera = async (id, granja_id, data) => {
  const { nombre, activo } = data;

  await validateParideraExists(id, granja_id);

  const dataToUpdate = { granja_id: Number(granja_id) };

  if (nombre !== undefined) {
    await validateParideraNameUnique(nombre, granja_id);
    dataToUpdate.nombre = nombre;
  }
  if (activo !== undefined) dataToUpdate.activo = activo;

  return await prisma.paridera.update({
    where: { id: Number(id), granja_id: Number(granja_id) },
    data: dataToUpdate,
  });
};

export const deleteParidera = async (id, granja_id) => {
  const transaction = [];

  const paridera = await validateParideraExists(id, granja_id, true);

  const hasRecords =
    paridera.partos.length > 0 ||
    paridera.destetes.length > 0 ||
    paridera.muertos.length > 0 ||
    paridera.adopciones.length > 0 ||
    paridera.donaciones.length > 0;

  if (hasRecords) {
    transaction.push(
      prisma.cerda.update({
        where: { paridera_id: Number(id) },
        data: { paridera_id: null },
      })
    );
  }

  const [parideraDesactivada] = await prisma.$transaction([
    prisma.paridera.update({
      where: { id: Number(id) },
      data: {
        activo: false,
        disponible: false,
      },
    }),
    ...transaction,
  ]);
  return parideraDesactivada;
};

const validateParideraNameUnique = async (nombre, granja_id) => {
  const paridera = await prisma.paridera.findUnique({
    where: { nombre: nombre, granja_id: Number(granja_id) },
  });
  if (paridera) {
    throw new AppError("PARIDERA_EXISTS", 400);
  }
  return paridera;
};

const validateParideraExists = async (
  id,
  granja_id,
  withExtensions = false
) => {
  const paridera = await prisma.paridera.findFirst({
    where: { id: Number(id), granja_id: Number(granja_id) },
    include: withExtensions
      ? {
          partos: {
            take: 1,
            orderBy: { fecha: "desc" },
          },
          destetes: {
            take: 1,
            orderBy: { fecha: "desc" },
          },
          muertos: {
            take: 1,
            orderBy: { fecha: "desc" },
          },
          adopciones: {
            take: 1,
            orderBy: { fecha: "desc" },
          },
          donaciones: {
            take: 1,
            orderBy: { fecha: "desc" },
          },
        }
      : undefined,
  });
  if (!paridera) {
    throw new AppError("PARIDERA_NOT_FOUND", 404);
  }
  return paridera;
};
