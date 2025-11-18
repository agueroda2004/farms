// ? Formato de fecha: AAAA-MM-DD "2025-11-16T10:00:00.000Z"
// ✅
export function validateCreateCerda(req, res, next) {
  const errors = {};
  const data = req.body;

  if (!data || typeof data !== "object") {
    return res.status(400).json({ error: "Payload inválido." });
  }

  if (!data.nombre || String(data.nombre).trim() === "") {
    errors.nombre = "El campo 'nombre' es obligatorio.";
  }

  if (data.paridad === undefined) {
    errors.paridad = "El campo 'paridad' es obligatorio.";
  } else if (isNaN(Number(data.paridad))) {
    errors.paridad = "El campo 'paridad' debe ser un número válido.";
  }

  if (!data.fecha_ingreso || String(data.fecha_ingreso).trim() === "") {
    errors.fecha_ingreso = "El campo 'fecha_ingreso' es obligatorio.";
  } else {
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

  if (!data.raza_id) {
    errors.raza_id = "El campo 'raza_id' es obligatorio.";
  } else if (isNaN(Number(data.raza_id))) {
    errors.raza_id = "El campo 'raza_id' debe ser un número válido.";
  }

  if (!data.jaula_id) {
    errors.jaula_id = "El campo 'jaula_id' es obligatorio.";
  } else if (isNaN(Number(data.jaula_id))) {
    errors.jaula_id = "El campo 'jaula_id' debe ser un número válido.";
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
    return res.status(400).json({ error: "Payload inválido o vacío." });
  }

  if (data.paridad && isNaN(Number(data.paridad))) {
    errors.paridad = "El campo 'paridad' debe ser un número válido.";
  }

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

  if (data.raza_id && isNaN(Number(data.raza_id))) {
    errors.raza_id = "El campo 'raza_id' debe ser un número válido.";
  }

  if (data.jaula_id && isNaN(Number(data.jaula_id))) {
    errors.jaula_id = "El campo 'jaula_id' debe ser un número válido.";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }
  next();
}
