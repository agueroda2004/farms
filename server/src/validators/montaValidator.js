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

    if (!monta.fecha || String(monta.fecha).trim() === "") {
      errors.fecha = "The field 'fecha' is required.";
    } else {
      const fecha = new Date(monta.fecha);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      if (isNaN(fecha.getTime())) {
        errors.fecha = "The date format is invalid.";
      } else if (fecha > hoy) {
        errors.fecha = "The date cannot be a future date.";
      }
    }

    if (!monta.turno) {
      errors[`montas[${index}].turno`] = "Turno field is required.";
    } else if (!turnos.includes(monta.turno)) {
      errors[`montas[${index}].turno`] =
        "Turno field must be one of the following values: Mañana, Tarde, Noche.";
    }
  });
};
