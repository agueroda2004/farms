export function validateUsuario(req, res, next) {
  const errors = {};
  const data = req.body;

  if (!data || typeof data !== "object") {
    return { valid: false, errors: { body: "Payload inválido." } };
  }

  if (!data.nombre || String(data.nombre).trim() === "") {
    errors.nombre = "El campo 'nombre' es obligatorio.";
  }

  if (!data.email || String(data.email).trim() === "") {
    errors.email = "El campo 'email' es obligatorio.";
  } else {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(String(data.email).toLowerCase())) {
      errors.email = "El email no tiene formato válido.";
    }
  }

  if (!data.password || String(data.password).trim() === "") {
    errors.password = "El campo 'password' es obligatorio.";
  } else if (String(data.password).length < 6) {
    errors.password = "La contraseña debe tener al menos 6 caracteres.";
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

  if (data.admin !== undefined && typeof data.admin !== "boolean") {
    errors.admin = "El campo 'admin' debe ser booleano.";
  }

  if (Object.keys(errors).length > 0) return res.status(400).json(errors);
  next();
}

export const validateUpdateUsuario = (req, res, next) => {
  const errors = {};
  const data = req.body;

  if (!data || typeof data !== "object") {
    return res.status(400).json({ error: "Payload inválido." });
  }

  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (data.email && !re.test(String(data.email).toLowerCase())) {
    errors.email = "El email no tiene formato válido.";
  }

  if (data.password && String(data.password).length < 6) {
    errors.password = "La contraseña debe tener al menos 6 caracteres.";
  }

  if (isNaN(Number(data.granja_id))) {
    errors.granja_id = "El campo 'granja_id' debe ser un número válido.";
  }

  if (data.admin && typeof data.admin !== "boolean") {
    errors.admin = "El campo 'admin' debe ser booleano.";
  }
  if (data.activo && typeof data.activo !== "boolean") {
    errors.activo = "El campo 'activo' debe ser booleano.";
  }
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }
  next();
};
