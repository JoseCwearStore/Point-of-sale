import { Request, Response } from "express";
import { CreateUnitUseCase } from "../../application/create-unit.use-case";
import { DeleteUnitUseCase } from "../../application/delete-unit.use-case";
import { ListUnitsUseCase } from "../../application/list-unit.use-case";
import { UpdateUnitUseCase } from "../../application/update-unit.use-case";
import { ConflictError, NotFoundError } from "../../../../shared/errors";

export class UnitController {
    constructor(
        private readonly createUnit: CreateUnitUseCase,
        private readonly updateUnit: UpdateUnitUseCase,
        private readonly deleteUnit: DeleteUnitUseCase,
        private readonly listUnit: ListUnitsUseCase
    ) { }

    create = async (req: Request, res: Response): Promise<void> => {
        const { name, abbreviation } = req.body;
        if (typeof name !== "string" || name.trim() === "") {
            res.status(400).json({ error: "El campo 'name' es obligatorio y debe ser texto." });
            return;
        }
        if (typeof abbreviation !== "string" || abbreviation.trim() === "") {
            res.status(400).json({ error: "El campo 'abreviacion' es obligatorio y debe ser texto." });
            return;
        }
        try {
            const unit = await this.createUnit.execute({ name, abbreviation });
            res.status(201).json(unit);
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
    }

    list = async (_req: Request, res: Response): Promise<void> => {
        const units = await this.listUnit.execute();
        res.status(200).json(units);
    }

    update = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        const { name, abbreviation } = req.body;

        if (name !== undefined && (typeof name !== "string" || name.trim() === "")) {
            res.status(400).json({ error: "El campo 'name', si se manda, debe ser texto no vacío." });
            return;
        }

        if (typeof id !== "string" || id.trim() === "") {
            res.status(400).json({ error: "No se encontró el id de la categoria." });
            return;
        }

        if (abbreviation !== undefined && (typeof abbreviation !== "string" || abbreviation.trim() === "")) {
            res.status(400).json({ error: "El campo 'abbreviation', si se manda, debe ser texto no vacío." });
            return;
        }

        try {
            const unit = await this.updateUnit.execute(id, { name, abbreviation });
            res.status(200).json(unit);
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
    }

    delete = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        if (typeof id !== "string" || id.trim() === "") {
            res.status(400).json({ error: "No se encontró el id de la unidad." });
            return;
        }

        try {
            const deletedUnit = await this.deleteUnit.execute(id);
            res.status(200).json({ mensaje: 'Unidad eliminada', unidad: deletedUnit });

        } catch (error) {
            if (error instanceof NotFoundError) {
                res.status(404).json({ error: error.message });
                return;
            }
            throw error;
        }
    }
}