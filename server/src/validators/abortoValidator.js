export function validateCreateAborto(req, res, next) {
  const errors = {};
  const data = req.body;

  if (!data || typeof data !== "object") {
    return res.status(400).json({ error: "Payload invalid." });
  }

  if (!data.fecha || String(data.fecha).trim() === "") {
    errors.fecha = "The field 'fecha' is required.";
  } else {
    const fecha = new Date(data.fecha);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (isNaN(fecha.getTime())) {
      errors.fecha = "The date format is invalid.";
    } else if (fecha > hoy) {
      errors.fecha = "The date cannot be a future date.";
    }
  }

  if (!data.hora || String(data.hora).trim() === "") {
    errors.hora = "The field 'hora' is required.";
  } else {
    const hora = new Date(`1970-01-01T${data.hora}:00`);
    if (isNaN(hora.getTime())) {
      errors.hora = "The time format is invalid.";
    }
  }

  if (!data.cerda_id) {
    errors.cerda_id = "The field 'cerda_id' is required.";
  } else if (isNaN(Number(data.cerda_id))) {
    errors.cerda_id = "The field 'cerda_id' must be a valid number.";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }
  next();
}

export const validateUpdateAborto = (req, res, next) => {
  const errors = {};
  const data = req.body;

  if (!data || typeof data !== "object") {
    return res.status(400).json({ error: "Payload invalid" });
  }

  if (data.fecha_ingreso) {
    const fechaIngreso = new Date(data.fecha_ingreso);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (isNaN(fechaIngreso.getTime())) {
      errors.fecha_ingreso = "The date format is invalid.";
    } else if (fechaIngreso > hoy) {
      errors.fecha_ingreso = "The date cannot be a future date.";
    }
  }
  if (data.hora) {
    const hora = new Date(`1970-01-01T${data.hora}:00`);
    if (isNaN(hora.getTime())) {
      errors.hora = "The time format is invalid.";
    }
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }
  next();
};
