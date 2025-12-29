import { successMessages } from "../i18n/success/index.js";

export const successResponse = (res, req, status, code, data = null) => {
  const lang = req.user?.lang || "es";

  const message = successMessages[lang]?.[code] || code;

  return res.status(status).json({
    success: true,
    message,
    code,
    data,
  });
};
