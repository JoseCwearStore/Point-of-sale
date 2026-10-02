import { NewSaleRecord, Sale } from "../domain/sale.entity";

export interface SaleRepositoryPort {
    create(sale: NewSaleRecord): Promise<Sale>;
    findById(id: string): Promise<Sale | null>;
    list(): Promise<Sale[]>;
    cancel(id: string): Promise<Sale>;
}