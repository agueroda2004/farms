export const validateCreateDestete = (req, res, next) => {
  const data = req.body;
  const errors = {};

  if (!data || typeof data !== "object") {
    return res.status(400).json({ error: "Payload invalid." });
  }

  if (!data.fecha || String(data.fecha).trim() === "") {
    errors.fecha = "The field 'fecha' is required.";
  } else {
    const fecha = new Date(data.fecha);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (isNaN(fecha.getTime())) {
      errors.fecha = "The date format is invalid.";
    } else if (fecha > hoy) {
      errors.fecha = "The date cannot be a future date.";
    }
  }
  if (!data.cerda_id) {
    errors.cerda_id = "The field 'cerda_id' is required.";
  } else if (isNaN(Number(data.cerda_id))) {
    errors.cerda_id = "The field 'cerda_id' must be a valid number.";
  }
  if (!data.cantidad) {
    errors.cantidad = "The field 'cantidad' is required.";
  } else if (isNaN(Number(data.cantidad)) || Number(data.cantidad) < 0) {
    errors.cantidad =
      "The field 'cantidad' must be a valid non-negative number.";
  }
  if (!data.peso) {
    errors.peso = "The field 'peso' is required.";
  } else if (isNaN(Number(data.peso)) || Number(data.peso) < 0) {
    errors.peso = "The field 'peso' must be a valid non-negative number.";
  }
  if (!data.parcial) {
    errors.parcial = "The field 'parcial' is required.";
  } else if (typeof data.parcial !== "boolean") {
    errors.parcial = "The field 'parcial' must be a boolean.";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }
  next();
};

export const validateUpdateDestete = (req, res, next) => {
  const data = req.body;
  const errors = {};

  if (!data || typeof data !== "object") {
    return res.status(400).json({ error: "Payload invalid." });
  }
  if (data.fecha) {
    const fecha = new Date(data.fecha);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (isNaN(fecha.getTime())) {
      errors.fecha = "The date format is invalid.";
    } else if (fecha > hoy) {
      errors.fecha = "The date cannot be a future date.";
    }
  }
  if (data.cerda_id) {
    if (isNaN(Number(data.cerda_id))) {
      errors.cerda_id = "The field 'cerda_id' must be a valid number.";
    }
  }
  if (data.cantidad) {
    if (isNaN(Number(data.cantidad)) || Number(data.cantidad) < 0) {
      errors.cantidad =
        "The field 'cantidad' must be a valid non-negative number.";
    }
  }
  if (data.peso) {
    if (isNaN(Number(data.peso)) || Number(data.peso) < 0) {
      errors.peso = "The field 'peso' must be a valid non-negative number.";
    }
  }
  if (data.parcial) {
    if (typeof data.parcial !== "boolean") {
      errors.parcial = "The field 'parcial' must be a boolean.";
    }
  }
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }
  next();
};
