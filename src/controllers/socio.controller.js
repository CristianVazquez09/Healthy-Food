import { socioService } from "../services/socio.service.js";

export const listar = async (req, res, next) => {
  try {
    const limit = Number(req.query.limit ?? 50);
    const offset = Number(req.query.offset ?? 0);
    const socios = await socioService.listar({ limit, offset });
    res.json({ data: socios, meta: { limit, offset, count: socios.length } });
  } catch (e) { next(e); }
};
