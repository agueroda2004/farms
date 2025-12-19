import prisma from "../prismaClient.js";

export const createOperario = async (data) => {
  const { nombre, rol, granja_id, obersevacion } = data;
  return await prisma.operario.create({
    data: {
      nombre,
      rol,
      granja_id,
      obersevacion,
    },
  });
};

export const listOperarios = async (granja_id) => {
  const operarios = await prisma.operario.findMany({
    where: { granja_id },
  });
  return operarios;
};

export const getOperarioById = async (id) => {
  return await prisma.operario.findUnique({
    where: { id },
  });
};

export const updateOperario = async (id, data) => {
  const { nombre, rol, obersevacion, activo } = data;
  const operario = await prisma.operario.findUnique({
    where: { id },
  });
  if (!operario) {
    throw new Error("Operario not found");
  }
  return await prisma.operario.update({
    where: { id },
    data: {
      nombre,
      rol,
      obersevacion,
      activo,
    },
  });
};

export const deleteOperario = async (id) => {
  return await prisma.operario.delete({
    where: { id },
  });
};
