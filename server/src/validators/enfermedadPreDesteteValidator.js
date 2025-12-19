export const validateCreateEnfermedadPreDestete = (req, res, next) => {
  const data = req.body;
  const errors = [];

  if (!data || typeof data !== "object") {
    return res.status(400).json({ error: "Payload not valid." });
  }

  if (!data.nombre || String(data.nombre).trim() === "") {
    errors.push("Nombre is required.");
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  next();
};

export const validateUpdateEnfermedadPreDestete = (req, res, next) => {
  const data = req.body;
  const errors = [];

  if (!data || typeof data !== "object") {
    return res.status(400).json({ error: "Payload not valid." });
  }

  if (data.activo && typeof data.activo !== "boolean") {
    errors.push("Activo field must be boolean.");
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  next();
};
