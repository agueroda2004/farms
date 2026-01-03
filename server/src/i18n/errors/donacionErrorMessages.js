export const donacionErrorMessages = {
  es: {
    DONACION_NOT_FOUND: "Donación no encontrada.",
    CANNOT_DELETE_DONACION_AFTER_DESTETE:
      "No se puede eliminar la donación porque existe un destete posterior a la fecha de la donación.",
    DONACION_DATE_BEFORE_PARTO:
      "La fecha de la donación no puede ser anterior a la fecha del parto.",
    DONACION_DATE_AFTER_DESTETE:
      "La fecha de la donación no puede ser posterior a la fecha del destete.",
  },
  en: {
    DONACION_NOT_FOUND: "Donation not found.",
    CANNOT_DELETE_DONACION_AFTER_DESTETE:
      "Cannot delete donation because there is a weaning after the donation date.",
    DONACION_DATE_BEFORE_PARTO:
      "Donation date cannot be before the birth date.",
    DONACION_DATE_AFTER_DESTETE:
      "Donation date cannot be after the weaning date.",
  },
};
