export function validateIdParam(req, res, next) {
  const { id, granja_id } = req.params;
  if (id && isNaN(Number(id)))
    return res.status(400).json({ error: "ID inválido." });
  if (granja_id && isNaN(Number(granja_id)))
    return res.status(400).json({ error: "ID de granja inválido." });
  next();
}
