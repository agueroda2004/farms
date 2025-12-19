import prisma from "../prismaClient.js";

export const createDestete = async (data) => {
  const { fecha, cantidad, peso, parcial, cerda_id, granja_id } = data;

  const cerda = await prisma.cerda.findFirst({
    where: { id: cerda_id, granja_id },
    include: {
      partos: {
        take: 1,
        orderBy: { fecha: "desc" },
        include: {
          muertos: {
            where: {
              fecha: { gte: new Date("1900-01-01"), lte: new Date(fecha) },
            },
            orderBy: { fecha: "desc" },
          },
          adopciones: {
            where: {
              fecha: { gte: new Date("1900-01-01"), lte: new Date(fecha) },
            },
            orderBy: { fecha: "desc" },
          },
          donaciones: {
            where: {
              fecha: { gte: new Date("1900-01-01"), lte: new Date(fecha) },
            },
            orderBy: { fecha: "desc" },
          },
          destetes: {
            where: { parcial: true },
            orderBy: { fecha: "desc" },
          },
        },
      },
    },
  });

  if (!cerda) {
    throw new Error("Cerda not found.");
  }
  if (cerda.partos.length === 0) {
    throw new Error("Partos not found for the specified cerda.");
  }

  if (cerda.condicion !== "lactando") {
    throw new Error(
      `Cerda condition must be 'lactando' to register a destete. Current condition: ${cerda.condicion}`
    );
  }

  const ultimoParto = cerda.partos[0];
  const fechaDesteteValidacion = new Date(fecha);
  const fechaPartoValidacion = new Date(ultimoParto.fecha);
  const fechaMuertosValidacion = ultimoParto.muertos.length
    ? new Date(ultimoParto.muertos[0].fecha)
    : null;
  const fechaAdopcionesValidacion = ultimoParto.adopciones.length
    ? new Date(ultimoParto.adopciones[0].fecha)
    : null;
  const fechaDonacionesValidacion = ultimoParto.donaciones.length
    ? new Date(ultimoParto.donaciones[0].fecha)
    : null;
  const fechaDestetesParcialesValidacion = ultimoParto.destetes.length
    ? new Date(ultimoParto.destetes[0].fecha)
    : null;

  if (fechaDesteteValidacion < fechaPartoValidacion) {
    throw new Error(
      "The destete date cannot be earlier than the date of the last parto."
    );
  }
  if (
    fechaMuertosValidacion &&
    fechaMuertosValidacion < fechaDesteteValidacion
  ) {
    throw new Error(
      "The destete date cannot be earlier than the date of the last recorded muerto."
    );
  }
  if (
    fechaAdopcionesValidacion &&
    fechaAdopcionesValidacion < fechaDesteteValidacion
  ) {
    throw new Error(
      "The destete date cannot be earlier than the date of the last recorded adopcion."
    );
  }
  if (
    fechaDonacionesValidacion &&
    fechaDonacionesValidacion < fechaDesteteValidacion
  ) {
    throw new Error(
      "The destete date cannot be earlier than the date of the last recorded donacion."
    );
  }
  if (
    fechaDestetesParcialesValidacion &&
    fechaDestetesParcialesValidacion < fechaDesteteValidacion
  ) {
    throw new Error(
      "The destete date cannot be earlier than the date of the last recorded parcial destete."
    );
  }

  const totalMuertos = ultimoParto.muertos.reduce(
    (sum, m) => sum + m.cantidad,
    0
  );
  const totalAdopciones = ultimoParto.adopciones.reduce(
    (sum, a) => sum + a.cantidad,
    0
  );
  const totalDonaciones = ultimoParto.donaciones.reduce(
    (sum, d) => sum + d.cantidad,
    0
  );

  const lechonesEsperados =
    ultimoParto.nacidos_vivos -
    totalDonaciones -
    totalMuertos +
    totalAdopciones;

  if (cantidad > lechonesEsperados) {
    throw new Error(
      `The quantity of destete (${cantidad}) exceeds the expected number of piglets (${lechonesEsperados}).`
    );
  }
  if (cantidad < lechonesEsperados) {
    throw new Error(
      `The quantity of destete (${cantidad}) is less than the expected number of piglets (${lechonesEsperados}).`
    );
  }

  const desteteData = {
    fecha,
    cantidad,
    peso,
    parcial,
    cerda: { connect: { id: cerda_id } },
    granja: { connect: { id: granja_id } },
    paridera: { connect: { id: cerda.paridera_id } },
    parto: { connect: { id: ultimoParto.id } },
  };

  if (!parcial) {
    const [destete, ..._] = await prisma.$transaction([
      prisma.destete.create({ data: desteteData }),
      prisma.cerda.update({
        where: { id: cerda_id },
        data: { condicion: "destetada", paridera_id: null },
      }),
      prisma.paridera.update({
        where: { id: cerda.paridera_id },
        data: { disponible: true },
      }),
    ]);
    return destete;
  } else {
    const destete = await prisma.destete.create({ data: desteteData });
    return destete;
  }
};

export const listDestetes = async (granja_id) => {
  const destetes = await prisma.destete.findMany({
    where: { granja_id },
  });
  return destetes;
};

export const getDesteteById = async (id) => {
  const destete = await prisma.destete.findFirst({
    where: { id },
  });
  return destete;
};

// !
export const updateDestete = async (id, data) => {
  const { fecha, cantidad, peso, parcial } = data;
  const dataToUpdate = {};

  const destete = await prisma.destete.findFirst({
    where: { id },
  });
  if (!destete) {
    throw new Error("Destete not found.");
  }
  const cerda = await prisma.cerda.findFirst({
    where: { id: cerda_id, granja_id, activo: true },
    include: {
      servicios: {
        take: 1,
        orderBy: { fecha: "desc" },
        include: { montas: { take: 1, orderBy: { fecha: "desc" } } },
      },
      partos: {
        take: 1,
        orderBy: { fecha: "desc" },
        include: {
          muertos: {
            where: {
              fecha: {
                gte: new Date("1900-01-01"),
                lte: new Date(destete.fecha),
              },
            },
            orderBy: { fecha: "desc" },
          },
          adopciones: {
            where: {
              fecha: {
                gte: new Date("1900-01-01"),
                lte: new Date(destete.fecha),
              },
            },
            orderBy: { fecha: "desc" },
          },
          donaciones: {
            where: {
              fecha: {
                gte: new Date("1900-01-01"),
                lte: new Date(destete.fecha),
              },
            },
            orderBy: { fecha: "desc" },
          },
          destetes: {
            where: { parcial: true },
            orderBy: { fecha: "desc" },
          },
        },
      },
    },
  });
  if (!cerda) {
    throw new Error("Cerda not found.");
  }

  const ultimoParto = cerda.partos[0];

  if (fecha !== undefined) {
    const fechaDesteteValidacion = new Date(fecha);
    const fechaPartoValidacion = new Date(ultimoParto.fecha);
    const fechaMuertosValidacion = ultimoParto.muertos.length
      ? new Date(ultimoParto.muertos[0].fecha)
      : null;
    const fechaAdopcionesValidacion = ultimoParto.adopciones.length
      ? new Date(ultimoParto.adopciones[0].fecha)
      : null;
    const fechaDonacionesValidacion = ultimoParto.donaciones.length
      ? new Date(ultimoParto.donaciones[0].fecha)
      : null;
    const fechaDestetesParcialesValidacion = ultimoParto.destetes.length
      ? new Date(ultimoParto.destetes[0].fecha)
      : null;
    const fechaMontaValidacion = cerda.servicios.length
      ? new Date(cerda.servicios[0].montas[0].fecha)
      : null;

    if (fechaDesteteValidacion < fechaPartoValidacion) {
      throw new Error(
        "The destete date cannot be earlier than the date of the last parto."
      );
    }
    if (
      fechaMuertosValidacion &&
      fechaMuertosValidacion < fechaDesteteValidacion
    ) {
      throw new Error(
        "The destete date cannot be earlier than the date of the last recorded muerto."
      );
    }
    if (
      fechaAdopcionesValidacion &&
      fechaAdopcionesValidacion < fechaDesteteValidacion
    ) {
      throw new Error(
        "The destete date cannot be earlier than the date of the last recorded adopcion."
      );
    }
    if (
      fechaDonacionesValidacion &&
      fechaDonacionesValidacion < fechaDesteteValidacion
    ) {
      throw new Error(
        "The destete date cannot be earlier than the date of the last recorded donacion."
      );
    }
    if (
      fechaDestetesParcialesValidacion &&
      fechaDestetesParcialesValidacion < fechaDesteteValidacion
    ) {
      throw new Error(
        "The destete date cannot be earlier than the date of the last recorded parcial destete."
      );
    }
    if (fechaMontaValidacion && fechaMontaValidacion < fechaDesteteValidacion) {
      throw new Error("The destete date cannot be later than the monta date.");
    }
    dataToUpdate.fecha = fecha;
  }

  if (cantidad !== undefined) {
    const totalMuertos = ultimoParto.muertos.reduce(
      (sum, m) => sum + m.cantidad,
      0
    );
    const totalAdopciones = ultimoParto.adopciones.reduce(
      (sum, a) => sum + a.cantidad,
      0
    );
    const totalDonaciones = ultimoParto.donaciones.reduce(
      (sum, d) => sum + d.cantidad,
      0
    );

    const lechonesEsperados =
      ultimoParto.nacidos_vivos -
      totalDonaciones -
      totalMuertos +
      totalAdopciones;

    if (cantidad > lechonesEsperados) {
      throw new Error(
        `The quantity of destete (${cantidad}) exceeds the expected number of piglets (${lechonesEsperados}).`
      );
    }
    if (cantidad < lechonesEsperados) {
      throw new Error(
        `The quantity of destete (${cantidad}) is less than the expected number of piglets (${lechonesEsperados}).`
      );
    }
    dataToUpdate.cantidad = cantidad;
  }
  if (peso !== undefined) dataToUpdate.peso = peso;

  if (parcial !== undefined) {
    dataToUpdate.parcial = parcial;
    if (parcial === false) {
      const [updatedDestete, ..._] = await prisma.$transaction([
        prisma.destete.update({
          where: { id },
          data: dataToUpdate,
        }),
        prisma.cerda.update({
          where: { id: cerda.id },
          data: { condicion: "destetada", paridera_id: null },
        }),
        prisma.paridera.update({
          where: { id: cerda.paridera_id },
          data: { disponible: true },
        }),
      ]);
      return updatedDestete;
    }
    if (parcial === true) {
      const [updatedDestete, ..._] = await prisma.$transaction([
        prisma.destete.update({
          where: { id },
          data: dataToUpdate,
        }),
        prisma.cerda.update({
          where: { id: cerda.id },
          data: { condicion: "lactando", paridera_id: null },
        }),
      ]);
      return updatedDestete;
    }
  }
  const updatedDestete = await prisma.destete.update({
    where: { id },
    data: dataToUpdate,
  });
  return updatedDestete;
};

export const deleteDestete = async (id) => {
  const destete = await prisma.destete.delete({
    where: { id },
  });
  if (!destete) {
    throw new Error("Destete not found.");
  }
  const cerda = await prisma.cerda.findFirst({
    where: { id: cerda_id, granja_id, activo: true },
    include: {
      servicios: {
        take: 1,
        orderBy: { fecha: "desc" },
        include: { montas: { take: 1, orderBy: { fecha: "desc" } } },
      },
      partos: {
        take: 1,
        orderBy: { fecha: "desc" },
        include: {
          muertos: {
            where: {
              fecha: {
                gte: new Date("1900-01-01"),
                lte: new Date(destete.fecha),
              },
            },
            orderBy: { fecha: "desc" },
          },
          adopciones: {
            where: {
              fecha: {
                gte: new Date("1900-01-01"),
                lte: new Date(destete.fecha),
              },
            },
            orderBy: { fecha: "desc" },
          },
          donaciones: {
            where: {
              fecha: {
                gte: new Date("1900-01-01"),
                lte: new Date(destete.fecha),
              },
            },
            orderBy: { fecha: "desc" },
          },
          destetes: {
            where: { parcial: true },
            orderBy: { fecha: "desc" },
          },
        },
      },
    },
  });
  if (!cerda) {
    throw new Error("Cerda not found.");
  }

  const ultimoParto = cerda.partos[0];
  const fechaDesteteValidacion = new Date(fecha);

  if (destete.parcial === false) {
    const fechaMontaValidacion = cerda.servicios.length
      ? new Date(cerda.servicios[0].montas[0].fecha)
      : null;
    if (fechaMontaValidacion && fechaMontaValidacion > fechaDesteteValidacion) {
      throw new Error(
        "Cannot delete destete because there is a monta recorded after the destete date."
      );
    }
    const [deletedDestete, ..._] = await prisma.$transaction([
      prisma.destete.delete({ where: { id } }),
      prisma.cerda.update({
        where: { id: cerda.id },
        data: {
          condicion: "lactando",
          paridera_id: null,
        },
      }),
    ]);
    return deletedDestete;
  }
  if (destete.parcial === true) {
    const fechaMuertosValidacion = ultimoParto.muertos.length
      ? new Date(ultimoParto.muertos[0].fecha)
      : null;
    const fechaAdopcionesValidacion = ultimoParto.adopciones.length
      ? new Date(ultimoParto.adopciones[0].fecha)
      : null;
    const fechaDonacionesValidacion = ultimoParto.donaciones.length
      ? new Date(ultimoParto.donaciones[0].fecha)
      : null;
    const fechaDestetesParcialesValidacion = ultimoParto.destetes.length
      ? new Date(ultimoParto.destetes[0].fecha)
      : null;

    if (
      fechaMuertosValidacion &&
      fechaMuertosValidacion > fechaDesteteValidacion
    ) {
      throw new Error(
        "Cannot delete destete because there is a muerto recorded after the destete date."
      );
    }
    if (
      fechaAdopcionesValidacion &&
      fechaAdopcionesValidacion < fechaDesteteValidacion
    ) {
      throw new Error(
        "Cannot delete destete because there is an adopcion recorded after the destete date."
      );
    }
    if (
      fechaDonacionesValidacion &&
      fechaDonacionesValidacion < fechaDesteteValidacion
    ) {
      throw new Error(
        "Cannot delete destete because there is a donacion recorded after the destete date."
      );
    }
    if (
      fechaDestetesParcialesValidacion &&
      fechaDestetesParcialesValidacion < fechaDesteteValidacion
    ) {
      throw new Error(
        "Cannot delete destete because there is a parcial destete recorded after the destete date."
      );
    }
    const deletedDestete = await prisma.$transaction([
      prisma.destete.delete({ where: { id } }),
      prisma.cerda.update({
        where: { id: cerda.id },
        data: { condicion: "lactando", paridera_id: null },
      }),
    ]);
    return deletedDestete;
  }
};
