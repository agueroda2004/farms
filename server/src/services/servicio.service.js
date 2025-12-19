import prisma from "../prismaClient.js";

const condicionesValidas = ["destetada", "viva", "aborto"];

export const createServicio = async (data) => {
  const { cerda_id, jaula_id, granja_id, observacion, montas } = data;

  const cerda = await prisma.cerda.findUnique({ where: { id: cerda_id } });

  if (!condicionesValidas.includes(cerda.condicion)) {
    throw new Error("Cerda condition is not valid for service creation.");
  }

  const jaula = await prisma.jaula.findUnique({ where: { id: jaula_id } });

  if (!jaula.disponible) {
    throw new Error("Jaula is not available.");
  }

  const [servicio, ..._] = await prisma.$transaction([
    prisma.servicio.create({
      data: {
        cerda: { connect: { id: cerda_id } },
        jaula: { connect: { id: jaula_id } },
        granja: { connect: { id: granja_id } },
        observacion,
        montas: {
          create: montas.map((monta) => ({
            fecha: monta.fecha,
            berraco: { connect: { id: monta.berraco_id } },
            operario: { connect: { id: monta.operario_id } },
            granja: { connect: { id: granja_id } },
            turno: monta.turno,
            observacion: monta.observacion,
          })),
        },
      },
    }),
    prisma.cerda.update({
      where: { id: cerda_id },
      data: { condicion: "gestando" },
    }),
    prisma.jaula.update({
      where: { id: cerda.jaula_id },
      data: { disponible: true },
    }),
    prisma.jaula.update({
      where: { id: jaula_id },
      data: { disponible: false },
    }),
  ]);
  return servicio;
};

export const updateServicio = async (id, data) => {
  const { jaula_id, observacion, montas } = data;
  const servicioUpdateData = {};
  const servicio = await prisma.servicio.findUnique({ where: { id } });
  if (!servicio) {
    throw new Error("Servicio not found.");
  }

  if (observacion !== undefined) {
    servicioUpdateData.observacion = observacion;
  }

  if (montas && Array.isArray(montas)) {
    servicioUpdateData.montas = {
      deleteMany: { servicio_id: id },
      create: montas.map((monta) => ({
        fecha: monta.fecha,
        berraco: { connect: { id: monta.berraco_id } },
        operario: { connect: { id: monta.operario_id } },
        granja: { connect: { id: monta.granja_id } },
        turno: monta.turno,
        observacion: monta.observacion,
      })),
    };
  }

  if (jaula_id) {
    const jaula = await prisma.jaula.findUnique({
      where: { id: jaula_id },
    });

    if (!jaula || !jaula.disponible) {
      throw new Error("La nueva jaula no está disponible.");
    }

    servicioUpdateData.jaula = { connect: { id: jaula_id } };

    const [updatedServicio, ..._] = await prisma.$transaction([
      prisma.servicio.update({ where: { id }, data: servicioUpdateData }),
      prisma.jaula.update({
        where: { id: servicio.jaula_id },
        data: { disponible: true },
      }),
      prisma.jaula.update({
        where: { id: jaula_id },
        data: { disponible: false },
      }),
      prisma.cerda.update({
        where: { id: servicio.cerda_id },
        data: { jaula: { connect: { id: jaula_id } } },
      }),
    ]);
    return updatedServicio;
  } else {
    const updatedServicio = await prisma.servicio.update({
      where: { id },
      data: servicioUpdateData,
    });
    return updatedServicio;
  }
};

export const getServicioById = async (id) => {
  return prisma.servicio.findUnique({
    where: { id },
    include: { montas: true },
  });
};

export const listServicios = async (granja_id) => {
  return prisma.servicio.findMany({
    where: { granja_id },
    include: { montas: true },
  });
};

export const deleteServicio = async (id) => {
  const servicio = await prisma.servicio.findUnique({ where: { id } });
  if (!servicio) {
    throw new Error("Servicio not found.");
  }

  const [deletedServicio, ..._] = await prisma.$transaction([
    prisma.servicio.delete({ where: { id } }),
    prisma.cerda.update({
      where: { id: servicio.cerda_id },
      data: { condicion: servicio.condicion_anterior, jaula_id: null },
    }),
    prisma.jaula.update({
      where: { id: servicio.jaula_id },
      data: { disponible: true },
    }),
  ]);
  return deletedServicio;
};
