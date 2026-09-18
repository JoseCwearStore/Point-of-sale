import { NotFoundError } from "../../../shared/errors";
import { UnitUpdate, Unit } from "../domain/unit.entity";
import { UnitRepositoryPort } from "../ports/unit-repository.port";

export class UpdateUnitUseCase {
    constructor(private readonly unit: UnitRepositoryPort) { }

    async execute(id: string, input: UnitUpdate): Promise<Unit> {
        const existing = await this.unit.findById(id);
        if (!existing) throw new NotFoundError('Unidad', id);
        return this.unit.update(id, input);
    }
} 