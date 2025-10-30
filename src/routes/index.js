import { Router } from "express";
import sociosRouter from "./socios.routes.js";

const router = Router();
router.use("/socios", sociosRouter);

export default router;
