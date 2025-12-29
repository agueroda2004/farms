import { validateFecha } from "../utils/dateValidator.js";

const causas = ["desecho", "muerte", "sacrificio"];

export function validateCreateBerracoRemovido(req, res, next) {
  const errors = {};
  const data = req.body;

  if (!data || typeof data !== "object") {
    return res.status(400).json({ error: "Payload invalid." });
  }

  if (!data.causa || String(data.causa).trim() === "") {
    errors.causa = "The field 'causa' is required.";
  } else if (!causas.includes(data.causa)) {
    errors.causa = `The field 'causa' must be one of the following values: ${causas.join(
      ", "
    )}.`;
  }

  if (!data.berraco_id) {
    errors.berraco_id = "The field 'berraco_id' is required.";
  } else if (isNaN(Number(data.berraco_id))) {
    errors.berraco_id = "The field 'berraco_id' must be a valid number.";
  }

  validateFecha(data.fecha, errors);

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  next();
}

export function validateUpdateBerracoRemovido(req, res, next) {
  const errors = {};
  const data = req.body;

  if (!data || typeof data !== "object") {
    return res.status(400).json({ error: "Payload invalid." });
  }

  if (data.fecha) {
    validateFecha(data.fecha, errors);
  }

  if (data.causa) {
    if (!causas.includes(data.causa)) {
      errors.causa = `The field 'causa' must be one of the following values: ${causas.join(
        ", "
      )}.`;
    }
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  next();
}
