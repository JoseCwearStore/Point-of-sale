// infrastructure/http/ — aquí sabemos que existe Express: leemos req, escribimos res.
import type { Request, Response } from "express"
import { CreateCategoryUseCase } from "../../application/create-category.use-case"
import { ListCategoriesUseCase } from "../../application/list-categories.use-case"

export class CategoryController {
    constructor(
        private readonly createCategory: CreateCategoryUseCase,
        private readonly listCategory: ListCategoriesUseCase
    ) { }

    create = async (req: Request, res: Response): Promise<void> => {
        const { name, slug } = req.body;

        if (typeof name !== "string" || name.trim() === "") {
            res.status(400).json({ error: "El campo 'name' es obligatorio y debe ser texto." });
            return;
        }

        try {
            const category = await this.createCategory.execute({ name, slug });
            res.status(201).json(category);
        } catch (error) {
            if (error instanceof Error) {
                res.status(409).json({ error: error.message });
                return;
            }
            throw error
        }
    }

    list = async (_req: Request, res: Response): Promise<void> => {
        const categories = await this.listCategory.execute();
        res.status(200).json(categories);;
        return;
    }

}