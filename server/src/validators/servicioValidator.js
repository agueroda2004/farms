import { validateCreateMonta } from "./montaValidator.js";

export const validateCreateServicio = (req, res, next) => {
  const errors = {};
  const data = req.body;

  if (!data || typeof data !== "object") {
    return res.status(400).json({ error: "Invalid or empty payload." });
  }

  if (!data.cerda_id) {
    errors.cerda_id = "Cerda_id field is required.";
  } else if (isNaN(Number(data.cerda_id)) || Number(data.cerda_id) <= 0) {
    errors.cerda_id = "Cerda_id field must be a valid number.";
  }

  if (!data.jaula_id) {
    errors.jaula_id = "Jaula_id field is required.";
  } else if (isNaN(Number(data.jaula_id)) || Number(data.jaula_id) <= 0) {
    errors.jaula_id = "Jaula_id field must be a valid number.";
  }

  validateCreateMonta(data.montas || [], errors);

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }
  next();
};

export const validateUpdateServicio = (req, res, next) => {
  const errors = {};
  const data = req.body;

  if (!data || typeof data !== "object") {
    return res.status(400).json({ error: "Invalid or empty payload." });
  }

  if (isNaN(Number(data.jaula_id)) || Number(data.jaula_id) <= 0) {
    errors.jaula_id = "Jaula_id field must be a valid number.";
  }

  if (data.montas) {
    validateCreateMonta(data.montas || [], errors);
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }
  next();
};
