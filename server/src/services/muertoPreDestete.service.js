import prisma from "../prismaClient.js";

export const createMuertoPreDestete = async (data) => {
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
    granja_id,
  } = data;

  const cerda = await prisma.cerda.findFirst({
    where: {
      id: cerda_id,
      granja_id,
    },
    include: {
      partos: { take: 1, orderBy: { fecha: "desc" } },
    },
  });
  if (!cerda) {
    throw new Error("Cerda not found in this farm.");
  }
  if (cerda.condicion !== "lactando") {
    throw new Error("Cerda is not in lactating condition.");
  }
  if (cerda.partos.length === 0) {
    throw new Error("Cerda has no recorded partos.");
  }
  if (cerda.paridera_id === null) {
    throw new Error("Cerda is not assigned to any paridera.");
  }

  const ultimoParto = cerda.partos[0];
  const fechaMuerte = new Date(fecha);

  const fechaParto = new Date(ultimoParto.fecha);
  fechaParto.setHours(0, 0, 0, 0);
  fechaMuerte.setHours(0, 0, 0, 0);

  if (fechaMuerte < fechaParto) {
    throw new Error(
      "The death date cannot be earlier than the date of the last parto."
    );
  }

  const operario = await prisma.operario.findFirst({
    where: {
      id: operario_id,
      granja_id,
    },
  });
  if (!operario) {
    throw new Error("Operario not found in this farm.");
  }

  const enfermedad = await prisma.enfermedad_PreDestete.findFirst({
    where: {
      id: enfermedad_id,
      granja_id,
    },
  });
  if (!enfermedad) {
    throw new Error("Enfermedad pre-destete not found in this farm.");
  }

  return await prisma.muertos_PreDestete.create({
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
  return await prisma.muertos_PreDestete.findMany({
    where: { granja_id: granja_id },
  });
};

export const getMuertoPreDesteteById = async (id) => {
  return await prisma.muertos_PreDestete.findUnique({
    where: {
      id,
    },
  });
};
export const updateMuertoPreDestete = async (id, data) => {
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

  const muertoPreDestete = await prisma.muertos_PreDestete.findUnique({
    where: { id: Number(id) },
  });
  if (!muertoPreDestete) {
    throw new Error("Muerto pre-destete not found.");
  }

  const cerda = await prisma.cerda.findFirst({
    where: {
      id: muertoPreDestete.cerda_id,
      granja_id: muertoPreDestete.granja_id,
    },
    include: {
      partos: { take: 1, orderBy: { fecha: "desc" } },
    },
  });

  if (!cerda) {
    throw new Error("Cerda not found in this farm.");
  }
  if (cerda.condicion !== "lactando") {
    throw new Error("Cerda is not in lactating condition.");
  }
  if (cerda.partos.length === 0) {
    throw new Error("Cerda has no recorded births.");
  }
  if (cerda.paridera_id === null) {
    throw new Error("Cerda is not assigned to any paridera.");
  }

  if (fecha !== undefined) {
    const ultimoParto = cerda.partos[0];
    const fechaMuerte = new Date(fecha);

    const fechaParto = new Date(ultimoParto.fecha);
    fechaParto.setHours(0, 0, 0, 0);
    fechaMuerte.setHours(0, 0, 0, 0);

    if (fechaMuerte < fechaParto) {
      throw new Error(
        "The death date cannot be earlier than the date of the last birth."
      );
    }
    dataToUpdate.fecha = fecha;
  }
  if (cantidad !== undefined) dataToUpdate.cantidad = cantidad;
  if (observacion !== undefined) dataToUpdate.observacion = observacion;
  if (peso !== undefined) dataToUpdate.peso = peso;
  if (turno !== undefined) dataToUpdate.turno = turno;
  if (hora !== undefined) dataToUpdate.hora = hora;
  if (operario_id !== undefined) {
    const operario = await prisma.operario.findFirst({
      where: {
        id: operario_id,
        granja_id: muertoPreDestete.granja_id,
      },
    });
    if (!operario) {
      throw new Error("Operario not found in this farm.");
    }
    dataToUpdate.operario_id = operario_id;
  }
  if (enfermedad_id !== undefined) {
    const enfermedad = await prisma.enfermedad_PreDestete.findFirst({
      where: {
        id: enfermedad_id,
        granja_id: muertoPreDestete.granja_id,
      },
    });
    if (!enfermedad) {
      throw new Error("Enfermedad pre-destete not found in this farm.");
    }
    dataToUpdate.enfermedad_PreDestete_id = enfermedad_id;
  }
  return await prisma.muertos_PreDestete.update({
    where: { id: Number(id) },
    data: dataToUpdate,
  });
};

export const deleteMuertoPreDestete = async (id) => {
  const muertoPreDestete = await prisma.muertos_PreDestete.findUnique({
    where: { id: Number(id) },
  });
  if (!muertoPreDestete) {
    throw new Error("Muerto pre-destete not found.");
  }

  const destete = await prisma.destete.findFirst({
    where: {
      cerda_id: muertoPreDestete.cerda_id,
    },
  });

  if (destete.fecha >= muertoPreDestete.fecha) {
    throw new Error(
      "Cannot delete muerto pre-destete record because the cerda has already been destete after this date."
    );
  }

  return await prisma.muertos_PreDestete.delete({
    where: { id },
  });
};
