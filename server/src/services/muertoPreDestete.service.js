import prisma from "../prismaClient.js";
import { AppError } from "../errors/appError.js";

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

const validateDateMuerto = (fechaMuerte, ultimoParto) => {
  const fechaParto = new Date(ultimoParto.fecha);
  fechaParto.setHours(0, 0, 0, 0);
  fechaMuerte.setHours(0, 0, 0, 0);
  if (fechaMuerte < fechaParto) {
    throw new AppError("MUERTO_PRE_DESTETE_DATE_BEFORE_PARTO", 400);
  }
  if (ultimoDestete) {
    const fechaDestete = new Date(ultimoDestete.fecha);
    fechaDestete.setHours(0, 0, 0, 0);
    if (fechaMuerte > fechaDestete) {
      throw new AppError("MUERTO_PRE_DESTETE_DATE_AFTER_DESTETE", 400);
    }
  }
};

const validateOperarioExist = async (operario_id, granja_id) => {
  const operario = await prisma.operario.findFirst({
    where: {
      id: operario_id,
      granja_id,
    },
  });
  if (!operario) {
    throw new AppError("OPERARIO_NOT_FOUND", 404);
  }
  return operario;
};

const validateEnfermedadPreDesteteExist = async (enfermedad_id, granja_id) => {
  const enfermedad = await prisma.enfermedad_PreDestete.findFirst({
    where: {
      id: enfermedad_id,
      granja_id,
      activo: true,
    },
  });
  if (!enfermedad) {
    throw new AppError("ENFERMEDAD_PRE_DESTETE_NOT_FOUND", 404);
  }
  return enfermedad;
};

const validateMuertoPreDesteteExist = async (id, granja_id) => {
  const muertoPreDestete = await prisma.muerto_PreDestete.findFirst({
    where: {
      id,
      granja_id,
    },
  });
  if (!muertoPreDestete) {
    throw new AppError("MUERTO_PRE_DESTETE_NOT_FOUND", 404);
  }
  return muertoPreDestete;
};

export const createMuertoPreDestete = async (data, granja_id) => {
  const {
    fecha,
    cantidad,
    observacion,
    peso,
    turno,
    hora,
    operario_id,
    enfermedad_id,
    cerda_id,
  } = data;

  const cerda = await validateCerdaExist(cerda_id, granja_id);
  validateDateMuerto(fecha, cerda.partos[0], cerda.destetes[0] || null);
  await validateOperarioExist(operario_id, granja_id);
  await validateEnfermedadPreDesteteExist(enfermedad_id, granja_id);

  return await prisma.muerto_PreDestete.create({
    data: {
      fecha,
      cantidad,
      observacion,
      peso,
      turno,
      hora,
      operario: { connect: { id: Number(operario_id) } },
      enfermedad: { connect: { id: Number(enfermedad_id) } },
      cerda: { connect: { id: Number(cerda_id) } },
      granja: { connect: { id: Number(granja_id) } },
      parto: { connect: { id: ultimoParto.id } },
      paridera: { connect: { id: cerda.paridera_id } },
    },
  });
};

export const listMuertoPreDestete = async (granja_id) => {
  return await prisma.muerto_PreDestete.findMany({
    where: { granja_id: granja_id },
  });
};

export const getMuertoPreDesteteById = async (id, granja_id) => {
  return await prisma.muerto_PreDestete.findUnique({
    where: {
      id,
    },
  });
};

export const updateMuertoPreDestete = async (id, granja_id, data) => {
  const {
    fecha,
    cantidad,
    observacion,
    peso,
    turno,
    hora,
    operario_id,
    enfermedad_id,
  } = data;
  const dataToUpdate = {};

  const muertoPreDestete = await validateMuertoPreDesteteExist(id, granja_id);
  const cerda = await validateCerdaExist(muertoPreDestete.cerda_id, granja_id);

  if (fecha !== undefined) {
    validateDateMuerto(fecha, cerda.partos[0]);
    dataToUpdate.fecha = fecha;
  }
  if (cantidad !== undefined) dataToUpdate.cantidad = cantidad;
  if (observacion !== undefined) dataToUpdate.observacion = observacion;
  if (peso !== undefined) dataToUpdate.peso = peso;
  if (turno !== undefined) dataToUpdate.turno = turno;
  if (hora !== undefined) dataToUpdate.hora = hora;
  if (operario_id !== undefined) {
    await validateOperarioExist(operario_id, granja_id);
    dataToUpdate.operario_id = operario_id;
  }
  if (enfermedad_id !== undefined) {
    await validateEnfermedadPreDesteteExist(enfermedad_id, granja_id);
    dataToUpdate.enfermedad_PreDestete_id = enfermedad_id;
  }
  return await prisma.muerto_PreDestete.update({
    where: { id: Number(id), granja_id: Number(granja_id) },
    data: dataToUpdate,
  });
};

export const deleteMuertoPreDestete = async (id, granja_id) => {
  const muertoPreDestete = await validateMuertoPreDesteteExist(id, granja_id);

  const cerda = await validateCerdaExist(muertoPreDestete.cerda_id, granja_id);

  if (cerda.destetes.length > 0) {
    const ultimoDestete = cerda.destetes[0];
    if (muertoPreDestete.fecha > ultimoDestete.fecha) {
      throw new AppError("MUERTO_PRE_DESTETE_CANNOT_DELETE_AFTER_DESTETE", 400);
    }
  }

  return await prisma.muerto_PreDestete.delete({
    where: { id: id, granja_id: granja_id },
  });
};
