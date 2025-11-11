export function validateGranja(data) {
  const errors = {};

  if (!data || typeof data !== "object") {
    return { valid: false, errors: { body: "Payload inválido." } };
  }

  if (!data.nombre || String(data.nombre).trim() === "") {
    errors.nombre = "El campo 'nombre' es obligatorio.";
  }

  if (data.activo !== undefined && typeof data.activo !== "boolean") {
    errors.activo = "El campo 'activo' debe ser booleano.";
  }

  if (Object.keys(errors).length === 0) return res.status(400).json(errors);
  next();
}

export function validateIdParam(req, res, next) {
  const { id } = req.params;
  if (isNaN(Number(id))) return res.status(400).json({ error: "ID inválido." });
  next();
}
