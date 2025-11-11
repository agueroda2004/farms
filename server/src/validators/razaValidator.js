export function validateRaza(req, res, next) {
  const errors = {};
  const data = req.body;

  if (!data || typeof data !== "object") {
    return res.status(400).json({ error: "Payload inválido." });
  }
  if (!data.nombre || String(data.nombre).trim() === "") {
    errors.nombre = "El campo 'nombre' es obligatorio.";
  }
  if (
    data.granja_id === undefined ||
    data.granja_id === null ||
    data.granja_id === ""
  ) {
    errors.granja_id = "El campo 'granja_id' es obligatorio.";
  } else if (isNaN(Number(data.granja_id))) {
    errors.granja_id = "El campo 'granja_id' debe ser un número válido.";
  }

  if (data.activo !== undefined && typeof data.activo !== "boolean") {
    errors.activo = "El campo 'activo' debe ser booleano.";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }
  next();
}
