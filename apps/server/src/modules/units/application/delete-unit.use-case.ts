import { ConflictError, NotFoundError } from "../../../shared/errors";
import { ProductRepositoryPort } from "../../products/ports/product-repository.port";
import { Unit } from "../domain/unit.entity";
import { UnitRepositoryPort } from "../ports/unit-repository.port";


export class DeleteUnitUseCase {
    constructor(
        private readonly unit: UnitRepositoryPort,
        private readonly product: ProductRepositoryPort

    ) { }

    async execute(id: string): Promise<Unit> {
        const have = await this.product.existsByUnitId(id);
        if (have) throw new ConflictError(`La unidad ${id} no se puede eliminar: Tiene productos relacionados`);
        const existing = await this.unit.findById(id);
        if (!existing) throw new NotFoundError("Unidad", id);
        return this.unit.delete(id);
    }
}