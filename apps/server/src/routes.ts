// routes.ts — aquí se registran los routers de TODOS los módulos.
// Cuando agregues un módulo nuevo (productos, ventas, clientes, etc.),
// solo tocas este archivo — server.ts no se vuelve a mover nunca.
import { Router } from "express";
import { categoryRoutes } from "./modules/categories/infrastructure/http/category.routes";

export const apiRouter = Router();

apiRouter.use("/categories", categoryRoutes);
// apiRouter.use("/products", productRoutes);
// apiRouter.use("/sales", saleRoutes);