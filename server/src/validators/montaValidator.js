import { validateFecha } from "../utils/dateValidator.js";
const turnos = ["Mañana", "Tarde", "Noche"];

export const validateCreateMonta = (montas, errors) => {
  if (montas.length === 0) {
    errors.montas = "Montas array cannot be empty.";
    return;
  }

  montas.forEach((monta, index) => {
    if (!monta.berraco_id) {
      errors[`montas[${index}].berraco_id`] = "Berraco_id field is required.";
    } else if (
      isNaN(Number(monta.berraco_id)) ||
      Number(monta.berraco_id) <= 0
    ) {
      errors[`montas[${index}].berraco_id`] =
        "Berraco_id field must be a valid number.";
    }

    if (!monta.operario_id) {
      errors[`montas[${index}].operario_id`] = "Operario_id field is required.";
    } else if (
      isNaN(Number(monta.operario_id)) ||
      Number(monta.operario_id) <= 0
    ) {
      errors[`montas[${index}].operario_id`] =
        "Operario_id field must be a valid number.";
    }

    validateFecha(monta.fecha, errors);

    if (!monta.turno) {
      errors[`montas[${index}].turno`] = "Turno field is required.";
    } else if (!turnos.includes(monta.turno)) {
      errors[`montas[${index}].turno`] =
        "Turno field must be one of the following values: Mañana, Tarde, Noche.";
    }
  });
};
