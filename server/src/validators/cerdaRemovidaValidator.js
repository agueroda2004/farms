export function validateCreateCerdaRemovida(req, res, next) {
  const errors = {};
  const data = req.body;

  if (!data || typeof data !== "object") {
    return res.status(400).json({ error: "Payload inválido o vacío." });
  }

  if (!data.causa) {
    errors.causa = "El campo 'causa' es obligatorio.";
  }

  if (!data.fecha || String(data.fecha).trim() === "") {
    errors.fecha = "El campo 'fecha' es obligatorio.";
  } else {
    const fecha = new Date(data.fecha);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (isNaN(fecha.getTime())) {
      errors.fecha = "El formato de la fecha es inválido.";
    } else if (fecha > hoy) {
      errors.fecha = "La fecha no puede ser una fecha futura.";
    }
  }

  if (!data.granja_id) {
    errors.granja_id = "El campo 'granja_id' es obligatorio.";
  } else if (isNaN(Number(data.granja_id))) {
    errors.granja_id = "El campo 'granja_id' debe ser un número válido.";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  next();
}

export function validateUpdateCerdaRemovida(req, res, next) {
  const errors = {};
  const data = req.body;

  if (data.fecha_ingreso) {
    const fechaIngreso = new Date(data.fecha_ingreso);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (isNaN(fechaIngreso.getTime())) {
      errors.fecha_ingreso = "El formato de la fecha de ingreso es inválido.";
    } else if (fechaIngreso > hoy) {
      errors.fecha_ingreso =
        "La fecha de ingreso no puede ser una fecha futura.";
    }
  }

  if (!data.granja_id) {
    errors.granja_id = "El campo 'granja_id' es obligatorio.";
  } else if (isNaN(Number(data.granja_id))) {
    errors.granja_id = "El campo 'granja_id' debe ser un número válido.";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }
  next();
}
