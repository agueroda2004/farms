export function validateIdParam(req, res, next) {
  const { id } = req.params;
  if (id && isNaN(Number(id)))
    return res.status(400).json({ error: "ID inválido." });
  next();
}
