export function validateCreateBerraco(req, res, next) {
  const errors = {};
  const data = req.body;

  if (!data || typeof data !== "object") {
    return res.status(400).json({ error: "Payload inválido o vacío." });
  }

  if (!data.nombre || String(data.nombre).trim() === "") {
    errors.nombre = "El campo 'nombre' es obligatorio.";
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

export function validateUpdateBerraco(req, res, next) {
  const errors = {};
  const data = req.body;

  if (!data || typeof data !== "object") {
    return res.status(400).json({ error: "Payload inválido o vacío." });
  }
  if (data.nombre || String(data.nombre).trim() === "") {
    errors.nombre = "El campo 'nombre' no puede estar vacío.";
  }

  if (data.granja_id) {
    errors.granja_id = "El campo 'granja_id' es obligatorio.";
  } else if (isNaN(Number(data.granja_id))) {
    errors.granja_id = "El campo 'granja_id' debe ser un número válido.";
  }

  if (data.raza_id) {
    errors.raza_id = "El campo 'raza_id' es obligatorio.";
  } else if (isNaN(Number(data.raza_id))) {
    errors.raza_id = "El campo 'raza_id' debe ser un número válido.";
  }

  if (data.jaula_id) {
    errors.jaula_id = "El campo 'jaula_id' es obligatorio.";
  } else if (isNaN(Number(data.jaula_id))) {
    errors.jaula_id = "El campo 'jaula_id' debe ser un número válido.";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }
  next();
}
