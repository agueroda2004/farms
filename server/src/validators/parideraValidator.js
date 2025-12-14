export const validateCreateParidera = async (req, res, next) => {
  const errors = {};
  const data = req.body;

  if (!data || typeof data !== "object") {
    return res.status(400).json({ error: "Invalid or empty payload." });
  }

  if (!data.nombre || data.nombre.trim() === "") {
    errors.nombre = "Nombre field is required.";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }
  next();
};

export const validateUpdateParidera = (req, res, next) => {
  const errors = {};
  const data = req.body;

  if (!data || typeof data !== "object") {
    return res.status(400).json({ error: "Invalid or empty payload." });
  }

  if (data.activo !== undefined && typeof data.activo !== "boolean") {
    errors.activo = "Activo field must be a boolean.";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }
  next();
};
