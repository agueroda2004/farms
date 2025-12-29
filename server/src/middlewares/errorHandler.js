import { errorMessages } from "../i18n/errors/index.js";

export const errorHandler = (err, req, res, next) => {
  const lang = req.user?.lang || "es";

  if (err.code) {
    const message = errorMessages[lang]?.[err.code] || err.code;

    return res
      .status(err.status)
      .json({ success: false, message, code: err.code });
  }

  return res.status(500).json({
    success: false,
    message:
      lang === "es" ? "Error interno del servidor" : "Internal server error",
  });
};
