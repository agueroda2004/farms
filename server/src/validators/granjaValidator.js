export function validateCreateGranja(req, res, next) {
  const errors = {};
  const data = req.body;

  if (!data || typeof data !== "object") {
    return res.status(400).json({ error: "Payload invalid." });
  }

  if (!data.nombre || String(data.nombre).trim() === "") {
    errors.nombre = "The 'nombre' field is required.";
  }

  if (Object.keys(errors).length > 0) return res.status(400).json(errors);
  next();
}

export function validateUpdateGranja(req, res, next) {
  const errors = {};
  const data = req.body;

  if (!data || typeof data !== "object") {
    return res.status(400).json({ error: "Payload invalid." });
  }

  if (data.activo && typeof data.activo !== "boolean") {
    errors.activo = "The 'activo' field must be a boolean.";
  }

  if (Object.keys(errors).length > 0) return res.status(400).json(errors);
  next();
}
