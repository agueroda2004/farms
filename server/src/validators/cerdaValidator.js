// ? Formato de fecha: AAAA-MM-DD "2025-11-16T10:00:00.000Z"

export function validateCreateCerda(req, res, next) {
  const errors = {};
  const data = req.body;

  if (!data || typeof data !== "object") {
    return res.status(400).json({ error: "Invalid payload." });
  }

  if (!data.nombre || String(data.nombre).trim() === "") {
    errors.nombre = "Nombre is required.";
  }

  if (data.paridad === undefined) {
    errors.paridad = "Paridad is required.";
  } else if (isNaN(Number(data.paridad))) {
    errors.paridad = "Paridad must be a valid number.";
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

  if (!data.raza_id) {
    errors.raza_id = "Raza_id is required.";
  } else if (isNaN(Number(data.raza_id))) {
    errors.raza_id = "Raza_id must be a valid number.";
  }

  if (!data.jaula_id) {
    errors.jaula_id = "Jaula_id is required.";
  } else if (isNaN(Number(data.jaula_id))) {
    errors.jaula_id = "Jaula_id must be a valid number.";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }
  next();
}

export function validateUpdateCerda(req, res, next) {
  const errors = {};
  const data = req.body;

  if (!data || typeof data !== "object" || Object.keys(data).length === 0) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  if (data.paridad && isNaN(Number(data.paridad))) {
    errors.paridad = "Paridad must be a valid number.";
  }

  if (data.fecha_ingreso) {
    const fechaIngreso = new Date(data.fecha_ingreso);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (isNaN(fechaIngreso.getTime())) {
      errors.fecha_ingreso = "Fecha_ingreso format is invalid.";
    } else if (fechaIngreso > hoy) {
      errors.fecha_ingreso = "Fecha_ingreso cannot be a future date.";
    }
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
