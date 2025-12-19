import prisma from "../prismaClient.js";

export const createAdopcion = async (data) => {
  const { fecha, cantidad, peso, cerda_id, granja_id } = data;

  const cerda = await prisma.cerda.findUnique({
    where: { id: cerda_id, granja_id },
    include: {
      partos: {
        take: 1,
        orderBy: { fecha: "desc" },
      },
    },
  });
  if (!cerda) {
    throw new Error("Cerda not found in the specified granja.");
  }
  if (cerda.partos.length === 0) {
    throw new Error("Cerda has no recorded partos.");
  }

  const ultimoParto = cerda.partos[0];
  const fechaMuerte = new Date(fecha);

  const fechaParto = new Date(ultimoParto.fecha);
  fechaParto.setHours(0, 0, 0, 0);
  fechaMuerte.setHours(0, 0, 0, 0);

  if (fechaMuerte < fechaParto) {
    throw new Error(
      "The adoption date cannot be earlier than the date of the last parto."
    );
  }

  const adopcion = await prisma.adopcion.create({
    data: {
      fecha,
      cantidad,
      peso,
      cerda: { connect: { id: cerda_id } },
      granja: { connect: { id: granja_id } },
      paridera: { connect: { id: cerda.partos[0].paridera_id } },
      parto: { connect: { id: cerda.partos[0].id } },
    },
  });
  return adopcion;
};

export const listAdopciones = async (granja_id) => {
  const adopciones = await prisma.adopcion.findMany({
    where: { granja_id },
  });
  return adopciones;
};

export const getAdopcionById = async (id) => {
  const adopcion = await prisma.adopcion.findFirst({
    where: { id },
  });
  return adopcion;
};

export const updateAdopcion = async (id, data) => {
  const { fecha, cantidad, peso } = data;
  const dataToUpdate = {};

  if (fecha !== undefined) {
    const ultimoParto = cerda.partos[0];
    const fechaMuerte = new Date(fecha);

    const fechaParto = new Date(ultimoParto.fecha);
    fechaParto.setHours(0, 0, 0, 0);
    fechaMuerte.setHours(0, 0, 0, 0);

    if (fechaMuerte < fechaParto) {
      throw new Error(
        "The adoption date cannot be earlier than the date of the last parto."
      );
    }
    dataToUpdate.fecha = fecha;
  }
  if (cantidad !== undefined) dataToUpdate.cantidad = cantidad;
  if (peso !== undefined) dataToUpdate.peso = peso;
  const updatedAdopcion = await prisma.adopcion.update({
    where: { id },
    data: dataToUpdate,
  });
  return updatedAdopcion;
};

export const deleteAdopcion = async (id) => {
  const adopcion = await prisma.adopcion.findUnique({
    where: { id: Number(id) },
  });
  if (!adopcion) {
    throw new Error("Adopcion not found.");
  }

  const destete = await prisma.destete.findFirst({
    where: {
      cerda_id: adopcion.cerda_id,
    },
  });

  if (destete.fecha >= adopcion.fecha) {
    throw new Error(
      "Cannot delete adopcion record because the cerda has already been destete after this date."
    );
  }

  const deletedAdopcion = await prisma.adopcion.delete({
    where: { id },
  });
  return deletedAdopcion;
};
