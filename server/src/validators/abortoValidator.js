export function validateCreateAborto(req, res, next) {
  const errors = {};
  const data = req.body;

  if (!data || typeof data !== "object") {
    return res.status(400).json({ error: "Payload inválido o vacío." });
  }

  if (!data.fecha || String(data.fecha).trim() === "") {
    errors.fecha = "El campo 'fecha' es obligatorio.";
  } else {
    const fecha = new Date(data.fecha);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (isNaN(fecha.getTime())) {
      errors.fecha = "El formato de la fecha es inválido.";
    } else if (fecha > hoy) {
      errors.fecha = "La fecha no puede ser una fecha futura.";
    }
  }

  if (!data.hora || String(data.hora).trim() === "") {
    errors.hora = "El campo 'hora' es obligatorio.";
  } else {
    const hora = new Date(`1970-01-01T${data.hora}:00`);
    if (isNaN(hora.getTime())) {
      errors.hora = "El formato de la hora es inválido.";
    }
  }

  if (!data.cerda_id) {
    errors.cerda_id = "El campo 'cerda_id' es obligatorio.";
  } else if (isNaN(Number(data.cerda_id))) {
    errors.cerda_id = "El campo 'cerda_id' debe ser un número válido.";
  }

  if (!data.granja_id) {
    errors.granja_id = "El campo 'granja_id' es obligatorio.";
  } else if (isNaN(Number(data.granja_id))) {
    errors.granja_id = "El campo 'granja_id' debe ser un número válido.";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }
  next();
}

export const validateUpdateAborto = (req, res, next) => {
  const errors = {};
  const data = req.body;

  if (!data || typeof data !== "object") {
    return res.status(400).json({ error: "Payload inválido o vacío." });
  }

  if (!data.cerda_id) {
    errors.cerda_id = "El campo 'cerda_id' es obligatorio.";
  } else if (isNaN(Number(data.cerda_id))) {
    errors.cerda_id = "El campo 'cerda_id' debe ser un número válido.";
  }

  if (!data.granja_id) {
    errors.granja_id = "El campo 'granja_id' es obligatorio.";
  } else if (isNaN(Number(data.granja_id))) {
    errors.granja_id = "El campo 'granja_id' debe ser un número válido.";
  }

  if (data.fecha_ingreso) {
    const fechaIngreso = new Date(data.fecha_ingreso);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (isNaN(fechaIngreso.getTime())) {
      errors.fecha_ingreso = "El formato de la fecha de ingreso es inválido.";
    } else if (fechaIngreso > hoy) {
      errors.fecha_ingreso =
        "La fecha de ingreso no puede ser una fecha futura.";
    }
  }
  if (data.hora) {
    const hora = new Date(`1970-01-01T${data.hora}:00`);
    if (isNaN(hora.getTime())) {
      errors.hora = "El formato de la hora es inválido.";
    }
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }
  next();
};
