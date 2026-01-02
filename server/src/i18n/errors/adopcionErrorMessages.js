export const adopcionErrorMessages = {
  es: {
    ADOPCION_DATE_BEFORE_PARTO:
      "La fecha de adopción no puede ser anterior a la fecha de parto.",
    ADOPCION_DATE_AFTER_DESTETE:
      "La fecha de adopción no puede ser posterior a la fecha de destete.",
    ADOPCION_NOT_FOUND: "Adopción no encontrada.",
    CANNOT_DELETE_ADOPCION_AFTER_DESTETE_EXISTS:
      "No se puede eliminar la adopción porque existen destetes posteriores.",
  },
  en: {
    ADOPCION_DATE_BEFORE_PARTO:
      "Adoption date cannot be before the birth date.",
    ADOPCION_DATE_AFTER_DESTETE:
      "Adoption date cannot be after the weaning date.",
    ADOPCION_NOT_FOUND: "Adoption not found.",
    CANNOT_DELETE_ADOPCION_AFTER_DESTETE_EXISTS:
      "Cannot delete adoption because there are subsequent weanings.",
  },
};
