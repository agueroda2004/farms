import prisma from "../prismaClient.js";

export const createBerraco = async (data) => {
  const { nombre, observacion, granja_id, raza_id, jaula_id, fecha_ingreso } =
    data;

  const jaula = await prisma.jaula.findUnique({
    where: { id: Number(jaula_id), activo: true },
  });

  const existingBerraco = await prisma.berraco.findUnique({
    where: { nombre: nombre, granja_id: Number(granja_id) },
  });

  if (existingBerraco) {
    throw new Error("Berraco with this nombre already exists.");
  }

  if (!jaula) {
    throw new Error("Jaula not found.");
  }

  if (!jaula.disponible) {
    throw new Error("Jaula is not available.");
  }

  const raza = await prisma.raza.findUnique({
    where: { id: Number(raza_id), activo: true },
  });

  if (!raza) {
    throw new Error("Raza not found.");
  }

  const berraco = await prisma.berraco.create({
    data: {
      nombre,
      observacion,
      fecha_ingreso,
      granja: { connect: { id: Number(granja_id) } },
      raza: { connect: { id: Number(raza_id) } },
      jaula: { connect: { id: Number(jaula_id) } },
    },
  });
  return berraco;
};

export const listBerracos = async (granja_id) => {
  return await prisma.berraco.findMany({
    where: { granja_id: granja_id },
  });
};

export const getBerracoById = async (id) => {
  return await prisma.berraco.findUnique({ where: { id: id } });
};

export const updateBerraco = async (id, data) => {
  const { activo, fecha_ingreso, observacion, jaula_id, raza_id } = data;
  const dataToUpdate = {};

  const berraco = await prisma.berraco.findUnique({
    where: { id: id },
  });

  if (!berraco) {
    throw new Error("Berraco not found.");
  }

  if (activo !== undefined) dataToUpdate.activo = activo;
  if (fecha_ingreso !== undefined) {
    const monta = await prisma.monta.findMany({
      where: {
        berraco_id: id,
      },
      take: 1,
      orderBy: { fecha: "desc" },
    });

    if (monta.fecha < fecha_ingreso) {
      throw new Error(
        "Cannot set fecha_ingreso later than the latest monta date."
      );
    }

    dataToUpdate.fecha_ingreso = fecha_ingreso;
  }
  if (observacion !== undefined) dataToUpdate.observacion = observacion;
  if (jaula_id !== undefined) {
    const jaula = await prisma.jaula.findUnique({
      where: { id: Number(jaula_id), activo: true },
    });
    if (!jaula) {
      throw new Error("Jaula not found.");
    }
    if (!jaula.disponible) {
      throw new Error("Jaula is not available.");
    }
    dataToUpdate.jaula = { connect: { id: Number(jaula_id) } };
  }
  if (raza_id !== undefined) {
    const raza = await prisma.raza.findUnique({
      where: { id: Number(raza_id), activo: true },
    });
    if (!raza) {
      throw new Error("Raza not found.");
    }
    dataToUpdate.raza = { connect: { id: Number(raza_id) } };
  }

  return await prisma.berraco.update({ where: { id: id }, data: dataToUpdate });
};
