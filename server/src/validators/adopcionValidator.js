import { validateFecha } from "../utils/dateValidator.js";

export const validateCreateAdopcion = (req, res, next) => {
  const errors = {};
  const data = req.body;

  if (!data || typeof data !== "object") {
    return res.status(400).json({ error: "Invalid or empty payload." });
  }

  if (!data.cantidad) {
    errors.cantidad = "Cantidad field is required.";
  } else if (!isNaN(data.cantidad) || data.cantidad <= 0) {
    errors.cantidad = "Cantidad must be a positive number.";
  }

  if (!data.peso) {
    errors.peso = "Peso field is required.";
  } else if (!isNaN(data.peso) || data.peso <= 0) {
    errors.peso = "Peso must be a positive number.";
  }

  if (!data.cerda_id) {
    errors.cerda_id = "Cerda ID field is required.";
  } else if (!isNaN(data.cerda_id) || data.cerda_id <= 0) {
    errors.cerda_id = "Cerda ID must be a positive number.";
  }

  validateFecha(data.fecha, errors);

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }
  next();
};
export const validateUpdateAdopcion = (req, res, next) => {
  const errors = {};
  const data = req.body;

  if (!data || typeof data !== "object") {
    return res.status(400).json({ error: "Invalid or empty payload." });
  }

  if (data.cantidad) {
    if (!isNaN(data.cantidad) || data.cantidad <= 0) {
      errors.cantidad = "Cantidad must be a positive number.";
    }
  }

  if (data.peso) {
    if (!isNaN(data.peso) || data.peso <= 0) {
      errors.peso = "Peso must be a positive number.";
    }
  }

  if (data.cerda_id) {
    if (!isNaN(data.cerda_id) || data.cerda_id <= 0) {
      errors.cerda_id = "Cerda ID must be a positive number.";
    }
  }

  if (data.fecha) {
    validateFecha(data.fecha, errors);
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }
  next();
};
