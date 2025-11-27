export function validateCreateBerracoRemovido(req, res, next) {
  const errors = {};
  const data = req.body;

  if (!data || typeof data !== "object") {
    return res.status(400).json({ error: "Payload inválido o vacío." });
  }

  if (!data.causa || String(data.causa).trim() === "") {
    errors.causa = "El campo 'causa' es obligatorio.";
  }

  if (!data.granja_id) {
    errors.granja_id = "El campo 'granja_id' es obligatorio.";
  } else if (isNaN(Number(data.granja_id))) {
    errors.granja_id = "El campo 'granja_id' debe ser un número válido.";
  }

  if (!data.berraco_id) {
    errors.berraco_id = "El campo 'berraco_id' es obligatorio.";
  } else if (isNaN(Number(data.berraco_id))) {
    errors.berraco_id = "El campo 'berraco_id' debe ser un número válido.";
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

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  next();
}

export function validateUpdateBerracoRemovido(req, res, next) {
  const errors = {};
  const data = req.body;

  if (!data || typeof data !== "object") {
    return res.status(400).json({ error: "Payload inválido o vacío." });
  }

  if (!data.granja_id) {
    errors.granja_id = "El campo 'granja_id' es obligatorio.";
  } else if (isNaN(Number(data.granja_id))) {
    errors.granja_id = "El campo 'granja_id' debe ser un número válido.";
  }

  if (!data.berraco_id) {
    errors.berraco_id = "El campo 'berraco_id' es obligatorio.";
  } else if (isNaN(Number(data.berraco_id))) {
    errors.berraco_id = "El campo 'berraco_id' debe ser un número válido.";
  }

  if (data.fecha) {
    const fecha = new Date(data.fecha);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (isNaN(fecha.getTime())) {
      errors.fecha = "El formato de la fecha es inválido.";
    } else if (fecha > hoy) {
      errors.fecha = "La fecha no puede ser una fecha futura.";
    }
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  next();
}
