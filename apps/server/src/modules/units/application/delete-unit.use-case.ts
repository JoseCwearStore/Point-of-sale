import { NotFoundError } from "../../../shared/errors";
import { Unit } from "../domain/unit.entity";
import { UnitRepositoryPort } from "../ports/unit-repository.port";


export class DeleteUnitUseCase {
    constructor(private readonly unit: UnitRepositoryPort) { }

    async execute(id: string): Promise<Unit> {
        const existing = await this.unit.findById(id);
        if (!existing) throw new NotFoundError("Unidad", id);
        return this.unit.delete(id);
    }
}