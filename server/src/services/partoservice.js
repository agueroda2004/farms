import prisma from "../prismaClient.js";

export const createParto = async (data) => {
  const {
    cerda_id,
    vivos,
    muertos,
    momias,
    peso,
    paridera_id,
    turno,
    fecha,
    hora_inicio,
    hora_final,
    duracion,
    manipulada,
    observacion,
    granja_id,
    vacunas,
    operarios,
  } = data;

  const ultimoServicio = await prisma.servicio.findFirst({
    where: { cerda_id: Number(cerda_id) },
    orderBy: { id: "desc" },
    include: {
      montas: {
        orderBy: { fecha: "asc" },
        take: 1,
      },
    },
  });

  if (!ultimoServicio || ultimoServicio.montas.length === 0) {
    throw new Error(
      "Servicio not found or no montas associated with the last service."
    );
  }

  const fechaMonta = ultimoServicio.montas[0].fecha;
  const fechaParto = new Date(fecha);

  const diffTiempo = fechaParto.getTime() - fechaMonta.getTime();
  const diffDias = diffTiempo / (1000 * 3600 * 24);

  if (diffDias < 110) {
    throw new Error(
      `Parto creation failed. Only ${Math.floor(
        diffDias
      )} days have passed since the last monta (minimum 110 days required).`
    );
  }

  const cerda = await prisma.cerda.findUnique({
    where: { id: Number(cerda_id), activo: true, disponible: true },
  });

  if (!cerda) {
    throw new Error("Cerda not found.");
  }
  if (cerda.condicion !== "gestando") {
    throw new Error("Cerda aren't gestando, cannot register parto.");
  }

  const paridera = await prisma.paridera.findUnique({
    where: { id: Number(paridera_id), activo: true },
  });

  if (!paridera) {
    throw new Error("Paridera not found.");
  }
  if (!paridera.disponible) {
    throw new Error("Paridera is not available for assignment at this moment.");
  }

  const [parto, ..._] = await prisma.$transaction([
    prisma.parto.create({
      data: {
        cerda: { connect: { id: Number(cerda_id) } },
        vivos,
        muertos,
        momias,
        peso,
        paridera: { connect: { id: Number(paridera_id) } },
        turno,
        fecha,
        hora_inicio,
        hora_final,
        duracion,
        manipulada,
        observacion,
        granja: { connect: { id: Number(granja_id) } },

        operarios:
          operarios && operarios.length > 0
            ? {
                connect: operarios.map((id) => ({ id: Number(id) })),
              }
            : undefined,

        vacunas:
          vacunas && vacunas.length > 0
            ? {
                connect: vacunas.map((id) => ({ id: Number(id) })),
              }
            : undefined,
      },
    }),
    prisma.cerda.update({
      where: { id: Number(cerda_id) },
      data: { condicion: "lactando" },
    }),
    prisma.paridera.update({
      where: { id: Number(paridera_id) },
      data: { disponible: false },
    }),
  ]);

  return parto;
};

export const updateParto = async (id, data) => {
  const {
    vivos,
    muertos,
    momias,
    peso,
    paridera_id,
    turno,
    fecha,
    hora_inicio,
    hora_final,
    duracion,
    manipulada,
    observacion,
    vacunas,
    operarios,
  } = data;
  const dataToUpdate = {};

  const currentParto = await prisma.parto.findUnique({
    where: { id: Number(id) },
  });

  if (!currentParto) {
    throw new Error("Parto not found.");
  }

  if (fecha !== undefined) {
    const fechaPartoNueva = new Date(fecha);
    if (fechaPartoNueva.toDateString() !== currentParto.fecha.toDateString()) {
      const ultimoServicio = await prisma.servicio.findFirst({
        where: { cerda_id: currentParto.cerda_id },
        orderBy: { id: "desc" },
        include: { montas: { orderBy: { fecha: "asc" }, take: 1 } },
      });

      if (!ultimoServicio || ultimoServicio.montas.length === 0) {
        throw new Error(
          "Servicio not found or no montas associated with the last service."
        );
      }

      const fechaMonta = ultimoServicio.montas[0].fecha;
      const diffTiempo = fechaPartoNueva.getTime() - fechaMonta.getTime();
      const diffDias = diffTiempo / (1000 * 3600 * 24);

      if (diffDias < 110) {
        throw new Error(
          `The new parto date is invalid. Only ${Math.floor(
            diffDias
          )} days have passed since the monta (more than 110 are required).`
        );
      }
    }
    dataToUpdate.fecha = fecha;
  }

  if (vivos !== undefined) dataToUpdate.vivos = vivos;
  if (muertos !== undefined) dataToUpdate.muertos = muertos;
  if (momias !== undefined) dataToUpdate.momias = momias;
  if (peso !== undefined) dataToUpdate.peso = peso;
  if (turno !== undefined) dataToUpdate.turno = turno;
  if (hora_inicio !== undefined) dataToUpdate.hora_inicio = hora_inicio;
  if (hora_final !== undefined) dataToUpdate.hora_final = hora_final;
  if (manipulada !== undefined) dataToUpdate.manipulada = manipulada;
  if (observacion !== undefined) dataToUpdate.observacion = observacion;
  if (duracion !== undefined) dataToUpdate.duracion = duracion;

  if (operarios !== undefined) {
    dataToUpdate.operarios = {
      set: operarios.map((opId) => ({ id: Number(opId) })),
    };
  }
  if (vacunas !== undefined) {
    dataToUpdate.vacunas = {
      set: vacunas.map((vacId) => ({ id: Number(vacId) })),
    };
  }

  if (paridera_id !== undefined && currentParto.paridera_id !== undefined) {
    const parideraNueva = await prisma.paridera.findUnique({
      where: { id: Number(paridera_id) },
    });
    if (!parideraNueva || !parideraNueva.disponible) {
      throw new Error("Paridera not found or not available.");
    }

    dataToUpdate.paridera = { connect: { id: Number(paridera_id) } };

    const [updatedParto, ..._] = await prisma.$transaction([
      prisma.parto.update({ where: { id: Number(id) }, data: dataToUpdate }),
      prisma.paridera.update({
        where: { id: Number(paridera_id) },
        data: { disponible: false },
      }),
      prisma.paridera.update({
        where: { id: Number(currentParto.paridera_id) },
        data: { disponible: true },
      }),
    ]);
    return updatedParto;
  } else {
    const updatedParto = await prisma.parto.update({
      where: { id: Number(id) },
      data: dataToUpdate,
    });
    return updatedParto;
  }
};

export const getPartoById = async (id) => {
  return await prisma.parto.findUnique({
    where: { id: Number(id) },
  });
};

export const listPartos = async (granja_id) => {
  return await prisma.parto.findMany({
    where: { granja_id },
  });
};

export const deleteParto = async (id) => {
  const parto = await prisma.parto.findUnique({
    where: { id: Number(id) },
  });
  if (!parto) {
    throw new Error("Parto not found.");
  }

  const [deleteParto, ..._] = await prisma.$transaction([
    prisma.paridera.update({
      where: { id: parto.paridera_id },
      data: { disponible: true },
    }),
    prisma.parto.delete({ where: { id } }),
    prisma.cerda.update({
      where: { id: parto.cerda_id },
      data: { condicion: "gestando", paridera_id: null },
    }),
  ]);

  return deleteParto;
};
