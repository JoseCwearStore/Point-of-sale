import { NewUnit, Unit } from "../domain/unit.entity";
import { UnitRepositoryPort } from "../ports/unit-repository.port";


export class CreateUnitUseCase {
    constructor(private readonly unit: UnitRepositoryPort) { }
    async execute(input: NewUnit): Promise<Unit> { return this.unit.create(input) }
}