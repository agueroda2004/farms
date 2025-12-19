const turnos = ["Mañana", "Tarde", "Noche"];

export const validateCreateMuertoPreDestete = async (req, res, next) => {
  const data = req.body;
  const errors = {};

  if (!data || typeof data !== "object") {
    return res.status(400).json({ error: "Invalid or empty payload." });
  }

  if (!data.cerda_id) {
    errors.cerda_id = "cerda_id field is required.";
  } else if (isNaN(Number(data.cerda_id))) {
    errors.cerda_id = "cerda_id must be a valid number.";
  }

  if (!data.enfermedad_id) {
    errors.enfermedad_id = "enfermedad_id field is required.";
  } else if (isNaN(Number(data.enfermedad_id))) {
    errors.enfermedad_id = "enfermedad_id must be a valid number.";
  }

  if (!data.operario_id) {
    errors.operario_id = "operario_id field is required.";
  } else if (isNaN(Number(data.operario_id))) {
    errors.operario_id = "operario_id must be a valid number.";
  }

  if (!data.cantidad) {
    errors.cantidad = "cantidad field is required.";
  } else if (isNaN(Number(data.cantidad)) || Number(data.cantidad) < 1) {
    errors.cantidad = "cantidad must be a positive number.";
  }

  if (!data.peso) {
    errors.peso = "peso field is required.";
  } else if (isNaN(Number(data.peso)) || Number(data.peso) < 0) {
    errors.peso = "peso must be a non-negative number.";
  }

  if (!data.turno) {
    errors.turno = "turno field is required.";
  } else if (!turnos.includes(data.turno)) {
    errors.turno = `turno must be one of the following values: ${turnos.join(
      ", "
    )}.`;
  }

  if (!data.hora) {
    errors.hora = "hora field is required.";
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

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }
  next();
};

export const validateUpdateMuertoPreDestete = async (req, res, next) => {
  const data = req.body;
  const errors = {};

  if (!data || typeof data !== "object") {
    return res.status(400).json({ error: "Invalid or empty payload." });
  }

  if (data.enfermedad_id) {
    if (isNaN(Number(data.enfermedad_id))) {
      errors.enfermedad_id = "enfermedad_id must be a valid number.";
    }
  }

  if (data.operario_id) {
    if (isNaN(Number(data.operario_id))) {
      errors.operario_id = "operario_id must be a valid number.";
    }
  }

  if (data.cantidad) {
    if (isNaN(Number(data.cantidad)) || Number(data.cantidad) < 1) {
      errors.cantidad = "cantidad must be a positive number.";
    }
  }

  if (data.peso) {
    if (isNaN(Number(data.peso)) || Number(data.peso) < 0) {
      errors.peso = "peso must be a non-negative number.";
    }
  }

  if (data.turno) {
    if (!turnos.includes(data.turno)) {
      errors.turno = `turno must be one of the following values: ${turnos.join(
        ", "
      )}.`;
    }
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
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }
  next();
};
