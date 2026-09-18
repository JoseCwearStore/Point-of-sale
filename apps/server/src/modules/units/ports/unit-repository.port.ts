import type { NewUnit, Unit, UnitUpdate } from "../domain/unit.entity";

export interface UnitRepositoryPort {
    create(input: NewUnit): Promise<Unit>;
    update(id: string, input: UnitUpdate): Promise<Unit>;
    findById(id: string): Promise<Unit | null>;
    list(): Promise<Unit[]>
    delete(id: string): Promise<Unit>;
}