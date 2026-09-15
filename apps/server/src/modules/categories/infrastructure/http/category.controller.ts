// infrastructure/http/ — aquí sabemos que existe Express: leemos req, escribimos res.
import type { Request, Response } from "express";
import { CreateCategoryUseCase } from "../../application/create-category.use-case";
import { ListCategoriesUseCase } from "../../application/list-categories.use-case";
import { UpdateCategoryUseCase } from "../../application/update-category.use-case";
import { DeleteCategoryUseCase } from "../../application/delete-category.use-case";
import { NotFoundError, ConflictError } from "../../../../shared/errors";

export class CategoryController {
    constructor(
        private readonly createCategory: CreateCategoryUseCase,
        private readonly listCategory: ListCategoriesUseCase,
        private readonly updateCategory: UpdateCategoryUseCase,
        private readonly deleteCategory: DeleteCategoryUseCase
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
            if (error instanceof NotFoundError) {
                res.status(404).json({ error: error.message });
                return;
            }
            if (error instanceof ConflictError) {
                res.status(409).json({ error: error.message });
                return;
            }
            throw error;
        }
    };

    list = async (_req: Request, res: Response): Promise<void> => {
        const categories = await this.listCategory.execute();
        res.status(200).json(categories);
    };

    update = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        const { name, slug } = req.body;

        if (name !== undefined && (typeof name !== "string" || name.trim() === "")) {
            res.status(400).json({ error: "El campo 'name', si se manda, debe ser texto no vacío." });
            return;
        }

        if (typeof id !== "string" || id.trim() === "") {
            res.status(400).json({ error: "No se encontró el id de la categoria." });
            return;
        }

        try {
            const category = await this.updateCategory.execute(id, { name, slug });
            res.status(200).json(category);
        } catch (error) {
            if (error instanceof NotFoundError) {
                res.status(404).json({ error: error.message });
                return;
            }
            if (error instanceof ConflictError) {
                res.status(409).json({ error: error.message });
                return;
            }
            throw error;
        }
    };

    delete = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        if (typeof id !== "string" || id.trim() === "") {
            res.status(400).json({ error: "No se encontró el id de la categoria." });
            return;
        }

        try {
            const deletedCategory = await this.deleteCategory.execute(id);
            res.status(200).json({ mensaje: 'Categoria eliminada', category: deletedCategory });

        } catch (error) {
            if (error instanceof NotFoundError) {
                res.status(400).json({ error: error.message });
                return;
            }
            throw error;
        }

    }
}