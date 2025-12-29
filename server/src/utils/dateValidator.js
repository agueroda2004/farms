export const validateFecha = (fecha, errors) => {
  if (!fecha || String(fecha).trim() === "") {
    errors.fecha = "The field 'fecha' is required.";
    return;
  }

  const fechaDate = new Date(fecha);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  if (isNaN(fechaDate.getTime())) {
    errors.fecha = "The date format is invalid.";
    return;
  } else if (fechaDate > hoy) {
    errors.fecha = "The date cannot be a future date.";
    return;
  }
};
