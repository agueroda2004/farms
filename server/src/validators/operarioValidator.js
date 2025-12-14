const roles = ["administrador", "operario", "supervisor"];

export const validateCreateOperario = (req, res, next) => {
  const errors = {};
  const data = req.body;

  if (!data || typeof data !== "object") {
    return res.status(400).json({ error: "Invalid or empty payload." });
  }

  if (!data.nombre || String(data.nombre).trim() === "") {
    errors.nombre = "Nombre field is required.";
  }

  if (!data.rol || String(data.rol).trim() === "") {
    errors.rol = "Rol field is required.";
  } else if (!roles.includes(data.rol)) {
    errors.rol = `Rol field must be one of the following: ${roles.join(", ")}.`;
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

export const validateUpdateOperario = (req, res, next) => {
  const errors = {};
  const data = req.body;

  if (!data || typeof data !== "object") {
    return res.status(400).json({ error: "Invalid or empty payload." });
  }

  if (data.rol && !roles.includes(data.rol)) {
    errors.rol = `Rol field must be one of the following: ${roles.join(", ")}.`;
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }
  next();
};
