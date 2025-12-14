import prisma from "../prismaClient.js";

export const createCerda = async (data) => {
  const {
    nombre,
    paridad,
    fecha_ingreso,
    observacion,
    raza_id,
    jaula_id,
    granja_id,
  } = data;

  const existingCerda = await prisma.cerda.findUnique({
    where: { nombre: nombre, granja_id: Number(granja_id) },
  });

  if (existingCerda) {
    throw new Error("Cerda with this nombre already exists.");
  }

  const raza = await prisma.raza.findUnique({
    where: { id: Number(raza_id), activo: true },
  });

  if (!raza) {
    throw new Error("Raza not found.");
  }

  const jaula = await prisma.jaula.findUnique({
    where: { id: Number(jaula_id), activo: true },
  });

  if (!jaula) {
    throw new Error("Jaula not found.");
  }

  if (!jaula.disponible) {
    throw new Error("Jaula is not available.");
  }

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

export const getCerdaById = async (id) => {
  return await prisma.cerda.findUnique({ where: { id: id } });
};

export const updateCerda = async (id, data) => {
  const {
    nombre,
    paridad,
    fecha_ingreso,
    activo,
    observacion,
    raza_id,
    jaula_id,
    granja_id,
  } = data;
  const dataToUpdate = {};

  if (nombre !== undefined) {
    const cerda = await prisma.cerda.findUnique({
      where: { nombre: nombre, granja_id: Number(granja_id) },
    });
    if (cerda) {
      throw new Error("Cerda with this nombre already exists.");
    }
    dataToUpdate.nombre = nombre;
  }

  if (paridad !== undefined) dataToUpdate.paridad = Number(paridad);
  if (fecha_ingreso !== undefined) {
    const primeraMonta = await prisma.monta.findFirst({
      where: { cerda_id: id },
    });
    const desecho = await prisma.cerda_Removida.findUnique({
      where: { cerda_id: id },
    });

    if (primeraMonta && fecha_ingreso >= primeraMonta.fecha) {
      throw new Error(
        "Cannot change fecha_ingreso because cerda has others records."
      );
    }

    if (desecho && fecha_ingreso >= desecho.fecha_removida) {
      throw new Error(
        "Cannot change fecha_ingreso because cerda has others records."
      );
    }

    dataToUpdate.fecha_ingreso = fecha_ingreso;
  }
  if (activo !== undefined) dataToUpdate.activo = activo;
  if (observacion !== undefined) dataToUpdate.observacion = observacion;
  if (raza_id !== undefined) {
    const raza = await prisma.raza.findUnique({
      where: { id: Number(raza_id), activo: true },
    });
    if (!raza) {
      throw new Error("Raza not found.");
    }
    dataToUpdate.raza = { connect: { id: Number(raza_id) } };
  }

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

  return await prisma.cerda.update({ where: { id: id }, data: dataToUpdate });
};
