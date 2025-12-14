import prisma from "../prismaClient.js";

export const createVacuna = async (data) => {
  const { nombre, imagen, granja_id, descripcion } = data;
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

export const getVacunaById = async (id) => {
  return await prisma.vacuna.findUnique({
    where: { id: Number(id) },
  });
};

export const updateVacuna = async (id, data) => {
  const { nombre, imagen, descripcion, activo, granja_id } = data;
  const dataToUpdate = { granja_id: Number(granja_id) };

  if (nombre !== undefined) dataToUpdate.nombre = nombre;
  if (imagen !== undefined) dataToUpdate.imagen = imagen;
  if (descripcion !== undefined) dataToUpdate.descripcion = descripcion;
  if (activo !== undefined) dataToUpdate.activo = activo;

  return await prisma.vacuna.update({
    where: { id: Number(id) },
    data: dataToUpdate,
  });
};

export const deleteVacuna = async (id) => {
  return await prisma.vacuna.delete({
    where: { id: Number(id) },
  });
};
