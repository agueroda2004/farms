const turnos = ["Mañana", "Tarde", "Noche"];
export const validateCreateParto = (req, res, next) => {
  const errors = {};
  const data = req.body;

  if (!data || typeof data !== "object") {
    return res.status(400).json({ error: "Invalid or empty payload." });
  }

  if (!data.cerda_id) {
    errors.cerda_id = "Cerda ID field is required.";
  } else if (isNaN(Number(data.cerda_id)) || Number(data.cerda_id) <= 0) {
    errors.cerda_id = "Cerda ID must be a valid number.";
  }

  if (!data.vivos && data.vivos !== 0) {
    errors.vivos = "Vivos field is required.";
  } else if (isNaN(Number(data.vivos)) || Number(data.vivos) < 0) {
    errors.vivos = "Vivos must be a valid non-negative number.";
  }

  if (!data.muertos && data.muertos !== 0) {
    errors.muertos = "Muertos field is required.";
  } else if (isNaN(Number(data.muertos)) || Number(data.muertos) < 0) {
    errors.muertos = "Muertos must be a valid non-negative number.";
  }

  if (!data.momias && data.momias !== 0) {
    errors.momias = "Momias field is required.";
  } else if (isNaN(Number(data.momias)) || Number(data.momias) < 0) {
    errors.momias = "Momias must be a valid non-negative number.";
  }

  if (!data.peso && data.peso !== 0) {
    errors.peso = "Peso field is required.";
  } else if (isNaN(Number(data.peso)) || Number(data.peso) < 0) {
    errors.peso = "Peso must be a valid non-negative number.";
  }
  if (!data.turno) {
    errors.turno = "Turno field is required.";
  } else if (!turnos.includes(data.turno)) {
    errors.turno = `Turno must be one of the following values: ${turnos.join(
      ", "
    )}.`;
  }

  if (!data.paridera_id) {
    errors.paridera_id = "Paridera ID field is required.";
  } else if (isNaN(Number(data.paridera_id)) || Number(data.paridera_id) <= 0) {
    errors.paridera_id = "Paridera ID must be a valid number.";
  }

  if (!data.turno || data.turno.trim() === "") {
    errors.turno = "Turno field is required.";
  }

  if (!data.hora_inicio || data.hora_inicio.trim() === "") {
    errors.hora_inicio = "Hora de inicio field is required.";
  }

  if (!data.hora_final || data.hora_final.trim() === "") {
    errors.hora_final = "Hora final field is required.";
  }

  if (!data.duracion || data.duracion.trim() === "") {
    errors.duracion = "Duracion field is required.";
  }

  if (!data.manipulada) {
    errors.manipulada = "Manipulada field is required.";
  } else if (typeof data.manipulada !== "boolean") {
    errors.manipulada = "Manipulada must be a boolean value.";
  }

  if (data.vacunas) {
    data.vacunas.forEach((id) => {
      if (isNaN(Number(id)) || Number(id) <= 0) {
        errors.vacunas = "All Vacuna IDs must be valid numbers.";
      }
    });
  }

  if (!data.operarios) {
    data.operarios.forEach((id) => {
      if (isNaN(Number(id)) || Number(id) <= 0) {
        errors.operarios = "All Operario IDs must be valid numbers.";
      }
    });
  }

  if (!data.fecha || String(data.fecha).trim() === "") {
    errors.fecha = "Fecha field is required.";
  } else {
    const fecha = new Date(data.fecha);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (isNaN(fecha.getTime())) {
      errors.fecha = "Fecha format is invalid.";
    } else if (fecha > hoy) {
      errors.fecha = "Fecha cannot be a future date.";
    }
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }
  next();
};

export const validateUpdateParto = (req, res, next) => {
  const errors = {};
  const data = req.body;

  if (!data || typeof data !== "object") {
    return res.status(400).json({ error: "Invalid or empty payload." });
  }

  if (data.vivos && data.vivos !== 0) {
    if (isNaN(Number(data.vivos)) || Number(data.vivos) < 0) {
      errors.vivos = "Vivos must be a valid non-negative number.";
    }
  }

  if (data.muertos && data.muertos !== 0) {
    if (isNaN(Number(data.muertos)) || Number(data.muertos) < 0) {
      errors.muertos = "Muertos must be a valid non-negative number.";
    }
  }

  if (data.momias && data.momias !== 0) {
    if (isNaN(Number(data.momias)) || Number(data.momias) < 0) {
      errors.momias = "Momias must be a valid non-negative number.";
    }
  }

  if (data.peso && data.peso !== 0) {
    if (isNaN(Number(data.peso)) || Number(data.peso) < 0) {
      errors.peso = "Peso must be a valid non-negative number.";
    }
  }

  if (data.paridera_id) {
    if (isNaN(Number(data.paridera_id)) || Number(data.paridera_id) <= 0) {
      errors.paridera_id = "Paridera ID must be a valid number.";
    }
  }

  if (data.manipulada) {
    if (typeof data.manipulada !== "boolean") {
      errors.manipulada = "Manipulada must be a boolean value.";
    }
  }

  if (data.vacunas) {
    data.vacunas.forEach((id) => {
      if (isNaN(Number(id)) || Number(id) <= 0) {
        errors.vacunas = "All Vacuna IDs must be valid numbers.";
      }
    });
  }

  if (data.operarios) {
    data.operarios.forEach((id) => {
      if (isNaN(Number(id)) || Number(id) <= 0) {
        errors.operarios = "All Operario IDs must be valid numbers.";
      }
    });
  }
  if (data.turno) {
    if (!turnos.includes(data.turno)) {
      errors.turno = `Turno must be one of the following values: ${turnos.join(
        ", "
      )}.`;
    }
  }

  if (data.fecha || String(data.fecha).trim() === "") {
    const fecha = new Date(data.fecha);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (isNaN(fecha.getTime())) {
      errors.fecha = "Fecha format is invalid.";
    } else if (fecha > hoy) {
      errors.fecha = "Fecha cannot be a future date.";
    }
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }
  next();
};
