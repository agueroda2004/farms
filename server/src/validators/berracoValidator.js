export function validateCreateBerraco(req, res, next) {
  const errors = {};
  const data = req.body;

  if (!data || typeof data !== "object") {
    return res.status(400).json({ error: "Payload invalid." });
  }

  if (!data.nombre || String(data.nombre).trim() === "") {
    errors.nombre = "Name field is required.";
  }

  if (!data.raza_id) {
    errors.raza_id = "Raza_id field is required.";
  } else if (isNaN(Number(data.raza_id))) {
    errors.raza_id = "Raza_id field must be a valid number.";
  }

  if (!data.jaula_id) {
    errors.jaula_id = "Jaula_id field is required.";
  } else if (isNaN(Number(data.jaula_id))) {
    errors.jaula_id = "Jaula_id field must be a valid number.";
  }

  if (!data.fecha_ingreso || String(data.fecha_ingreso).trim() === "") {
    errors.fecha_ingreso = "Fecha_ingreso is required.";
  } else {
    const fechaIngreso = new Date(data.fecha_ingreso);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (isNaN(fechaIngreso.getTime())) {
      errors.fecha_ingreso = "Fecha_ingreso format is invalid.";
    } else if (fechaIngreso > hoy) {
      errors.fecha_ingreso = "Fecha_ingreso cannot be a future date.";
    }
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }
  next();
}

export function validateUpdateBerraco(req, res, next) {
  const errors = {};
  const data = req.body;

  if (!data || typeof data !== "object") {
    return res.status(400).json({ error: "Invalid or empty payload." });
  }

  if (data.raza_id && isNaN(Number(data.raza_id))) {
    errors.raza_id = "Raza_id must be a valid number.";
  }

  if (data.jaula_id && isNaN(Number(data.jaula_id))) {
    errors.jaula_id = "Jaula_id must be a valid number.";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }
  next();
}
