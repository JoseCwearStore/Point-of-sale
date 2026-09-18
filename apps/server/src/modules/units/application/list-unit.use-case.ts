import { Unit } from "../domain/unit.entity";
import { UnitRepositoryPort } from "../ports/unit-repository.port";


export class ListUnitsUseCase {
    constructor(private readonly unit: UnitRepositoryPort) { }

    async execute(): Promise<Unit[]> { return this.unit.list() }
}