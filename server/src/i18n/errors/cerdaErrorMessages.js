export const cerdaErrorMessages = {
  es: {
    CERDA_NOT_FOUND: "Cerda no encontrada",
    CERDA_ID_EXISTS: "Ya existe una cerda con ese ID",
    CERDA_FECHA_INGRESO_INVALIDA:
      "La fecha de ingreso no puede ser anterior a la última monta o desecho",
    CERDA_CONDICION_INVALIDA:
      "La condición de la cerda no es válida para esta operación",
    CERDA_NOT_GESTANDO: "La cerda no está en condición de gestando",
    CERDA_NOT_LACTANDO: "La cerda no está en condición de lactando",
    CERDA_HAS_NOT_PARTOS:
      "La cerda no tiene partos registrados, no se puede registrar muerte pre-destete",
    CERDA_NOT_ASSIGNED_PARIDERA:
      "La cerda no está asignada a ninguna paridera, no se puede registrar muerte pre-destete",
  },
  en: {
    CERDA_NOT_FOUND: "Cerda not found",
    CERDA_ID_EXISTS: "A cerda with this ID already exists",
    CERDA_FECHA_INGRESO_INVALIDA:
      "The ingreso date cannot be earlier than the last mating or disposal date",
    CERDA_CONDICION_INVALIDA:
      "The cerda's condition is not valid for this operation",
    CERDA_NOT_GESTANDO: "The cerda is not in gestating condition",
    CERDA_NOT_LACTANDO: "The cerda is not in lactating condition",
    CERDA_HAS_NOT_PARTOS:
      "The cerda has no registered partos, cannot register pre-weaning death",
    CERDA_NOT_ASSIGNED_PARIDERA:
      "The cerda is not assigned to any paridera, cannot register pre-weaning death",
  },
};
