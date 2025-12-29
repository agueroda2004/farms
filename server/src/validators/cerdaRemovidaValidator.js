import { validateFecha } from "../utils/dateValidator.js";
const causas = ["desecho", "muerte", "sacrificio"];

export function validateCreateCerdaRemovida(req, res, next) {
  const errors = {};
  const data = req.body;

  if (!data || typeof data !== "object") {
    return res.status(400).json({ error: "Payload invalid." });
  }

  if (!data.causa) {
    errors.causa = "The field 'causa' is required.";
  } else if (!causas.includes(data.causa)) {
    errors.causa = `The field 'causa' must be one of the following values: ${causas.join(
      ", "
    )}.`;
  }

  validateFecha(data.fecha_ingreso, errors);

  if (!data.cerda_id) {
    errors.cerda_id = "The field 'cerda_id' is required.";
  } else if (isNaN(Number(data.cerda_id))) {
    errors.cerda_id = "The field 'cerda_id' must be a valid number.";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  next();
}

export function validateUpdateCerdaRemovida(req, res, next) {
  const errors = {};
  const data = req.body;

  if (data.fecha_ingreso) {
    validateFecha(data.fecha_ingreso, errors);
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
