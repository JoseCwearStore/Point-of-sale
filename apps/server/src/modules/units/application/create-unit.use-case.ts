import { NewUnit, Unit } from "../domain/unit.entity";
import { UnitRepositoryPort } from "../ports/unit-repository.port";
import { assertValidName } from "../../../shared/validators";
import { assertValidAbbreviation } from "../domain/unit.rules";

export class CreateUnitUseCase {
    constructor(private readonly unit: UnitRepositoryPort) { }

    async execute(input: NewUnit): Promise<Unit> {
        assertValidName(input.name, "nombre de unidad");
        assertValidAbbreviation(input.abbreviation);
        return this.unit.create(input);
    }
}
