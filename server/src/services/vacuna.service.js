import prisma from "../prismaClient.js";
import { AppError } from "../errors/appError.js";

export const createVacuna = async (data, granja_id) => {
  const { nombre, imagen, descripcion } = data;

  await validateVacunaNameUnique(nombre, granja_id);

  return await prisma.vacuna.create({
    data: {
      nombre,
      imagen,
      descripcion,
      granja: { connect: { id: Number(granja_id) } },
    },
  });
};

export const listVacunas = async (granja_id) => {
  const vacunas = await prisma.vacuna.findMany({
    where: { granja_id: Number(granja_id) },
  });
  return vacunas;
};

export const getVacunaById = async (id, granja_id) => {
  return await prisma.vacuna.findFirst({
    where: { id: Number(id), granja_id: Number(granja_id) },
  });
};

export const updateVacuna = async (id, granja_id, data) => {
  const { nombre, imagen, descripcion, activo } = data;
  const dataToUpdate = {};

  await validateVacunaExists(id, granja_id);

  if (nombre !== undefined) {
    await validateVacunaNameUnique(nombre, granja_id);
    dataToUpdate.nombre = nombre;
  }
  if (imagen !== undefined) dataToUpdate.imagen = imagen;
  if (descripcion !== undefined) dataToUpdate.descripcion = descripcion;
  if (activo !== undefined) dataToUpdate.activo = activo;

  return await prisma.vacuna.update({
    where: { id: Number(id) },
    data: dataToUpdate,
  });
};

export const deleteVacuna = async (id, granja_id) => {
  const vacuna = await validateVacunaExists(id, granja_id, true);

  if (vacuna.partos && vacuna.partos.length > 0) {
    return await prisma.vacuna.update({
      where: { id: Number(id) },
      data: { activo: false },
    });
  }

  return await prisma.vacuna.delete({
    where: { id: Number(id) },
  });
};

const validateVacunaNameUnique = async (name, granja_id) => {
  const vacuna = await prisma.vacuna.findFirst({
    where: { nombre: name, granja_id: Number(granja_id), activo: true },
  });
  if (vacuna) {
    throw new AppError("VACUNA_NAME_EXISTS", 400);
  }
  return vacuna;
};

const validateVacunaExists = async (id, granja_id, withExtencions = false) => {
  const vacuna = await prisma.vacuna.findFirst({
    where: { id: Number(id), granja_id: Number(granja_id) },
    include: {
      partos: withExtencions
        ? { take: 1, orderBy: { fecha: "desc" } }
        : undefined,
    },
  });
  if (!vacuna) {
    throw new AppError("VACUNA_NOT_FOUND", 404);
  }
  return vacuna;
};
