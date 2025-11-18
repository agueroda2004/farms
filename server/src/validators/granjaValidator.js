export function validateCreateGranja(req, res, next) {
  const errors = {};
  const data = req.body;

  if (!data || typeof data !== "object") {
    return res.status(400).json({ error: "Payload inválido." });
  }

  if (!data.nombre || String(data.nombre).trim() === "") {
    errors.nombre = "El campo 'nombre' es obligatorio.";
  }

  if (Object.keys(errors).length > 0) return res.status(400).json(errors);
  next();
}

export function validateUpdateGranja(req, res, next) {
  const errors = {};
  const data = req.body;

  if (!data || typeof data !== "object") {
    return res.status(400).json({ error: "Payload inválido." });
  }

  if (data.activo && typeof data.activo !== "boolean") {
    errors.activo = "El campo 'activo' debe ser booleano.";
  }

  if (Object.keys(errors).length > 0) return res.status(400).json(errors);
  next();
}
