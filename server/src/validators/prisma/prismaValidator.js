import { Prisma } from "@prisma/client";

// ? prismaCode:
// P2025: Registro no encontrado
// P2002: Violación de restricción de unicidad
// P2003: Violación de restricción de clave foránea

export const handlePrismaError = (error, req, res, next) => {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
    return next(error);
  }

  switch (error.code) {
    case "P2025":
      return res.status(404).json({
        message: "El registro no fue encontrado.",
        error: error.meta?.cause || "Not Found",
      });

    case "P2002":
      return res.status(409).json({
        message: `Ya existe un registro con este valor.`,
        field: error.meta?.target?.join(", "),
      });

    case "P2003":
      return res.status(409).json({
        message:
          "La operación no se puede completar porque el registro está en uso por otros registros.",
      });

    default:
      return next(error);
  }
};
