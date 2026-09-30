import { NotFoundError } from "../../../shared/errors";
import { UnitUpdate, Unit } from "../domain/unit.entity";
import { UnitRepositoryPort } from "../ports/unit-repository.port";
import { assertValidName } from "../../../shared/validators";
import { assertValidAbbreviation } from "../domain/unit.rules";

export class UpdateUnitUseCase {
    constructor(private readonly unit: UnitRepositoryPort) { }

    async execute(id: string, input: UnitUpdate): Promise<Unit> {
        const existing = await this.unit.findById(id);
        if (!existing) throw new NotFoundError('Unidad', id);

        if (input.name !== undefined) assertValidName(input.name, "nombre de unidad");
        if (input.abbreviation !== undefined) assertValidAbbreviation(input.abbreviation);

        return this.unit.update(id, input);
    }
}
