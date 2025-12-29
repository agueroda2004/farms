export function validateCreateRaza(req, res, next) {
  const errors = {};
  const data = req.body;

  if (!data || typeof data !== "object") {
    return res.status(400).json({ error: "Payload not valid." });
  }
  if (!data.nombre || String(data.nombre).trim() === "") {
    errors.nombre = "Nombre is required.";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }
  next();
}

export function validateUpdateRaza(req, res, next) {
  const errors = {};
  const data = req.body;

  if (!data || typeof data !== "object") {
    return res.status(400).json({ error: "Payload not valid." });
  }

  if (data.activo && typeof data.activo !== "boolean") {
    errors.activo = "Activo field must be boolean.";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }
  next();
}
