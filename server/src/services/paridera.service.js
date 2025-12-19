import prisma from "../prismaClient.js";

export const createParidera = async (data) => {
  const { nombre, granja_id } = data;
  const existingParidera = await prisma.paridera.findUnique({
    where: { nombre: nombre, granja_id: Number(granja_id) },
  });
  if (existingParidera) {
    throw new Error(
      "Paridera with the same name already exists in this granja."
    );
  }
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

export const getParideraById = async (id) => {
  const paridera = await prisma.paridera.findUnique({
    where: { id: Number(id) },
  });
  return paridera;
};

export const updateParidera = async (id, data) => {
  const { nombre, activo } = data;

  const paridera = await getParideraById(id);
  if (!paridera) {
    throw new Error("Paridera not found.");
  }

  const dataToUpdate = { granja_id: Number(granja_id) };

  if (nombre !== undefined) {
    const existingParidera = await prisma.paridera.findUnique({
      where: { nombre: nombre, granja_id: Number(paridera.granja_id) },
    });
    if (existingParidera && existingParidera.id !== paridera.id) {
      throw new Error(
        "Paridera with the same name already exists in this granja."
      );
    }
    dataToUpdate.nombre = nombre;
  }
  if (activo !== undefined) dataToUpdate.activo = activo;

  return await prisma.paridera.update({
    where: { id: Number(id) },
    data: dataToUpdate,
  });
};

export const desactivarParidera = async (id) => {
  const paridera = await prisma.paridera.findUnique({ where: { id: id } });
  const transaction = [];
  if (!paridera) {
    throw new Error("Paridera not found.");
  }

  const cerda = await prisma.cerda.findFirst({
    where: { paridera_id: Number(id) },
  });

  if (cerda) {
    transaction.push(
      prisma.cerda.update({
        where: { id: Number(cerda.id) },
        data: { paridera_id: null },
      })
    );
  }

  const [parideraDesactivada, ..._] = await prisma.$transaction([
    ...transaction,
    prisma.paridera.update({
      where: { id: Number(id) },
      data: {
        activo: false,
        disponible: false,
      },
    }),
  ]);
  return parideraDesactivada;
};

export const deleteParidera = async (id) => {
  return await prisma.paridera.delete({
    where: { id: Number(id) },
  });
};
