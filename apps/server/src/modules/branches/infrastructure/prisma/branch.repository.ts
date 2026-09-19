// infrastructure/prisma/ — aquí, y solo aquí, este módulo sabe que existe Prisma/Postgres.
import { PrismaClient, Branch as PrismaBranch } from "@prisma/client";
import { NewBranch, Branch, BranchUpdate } from "../../domain/branch.entity";
import { BranchRepositoryPort } from "../../ports/branch-repository.port";

function toDomain(row: PrismaBranch): Branch {
    return {
        id: row.id,
        name: row.name,
        address: row.address,
        phone: row.phone,
        createdAt: row.createdAt,
    };
}

export class PrismaBranchRepository implements BranchRepositoryPort {
    constructor(private readonly prisma: PrismaClient) { }

    async create(data: NewBranch): Promise<Branch> {
        const row = await this.prisma.branch.create({
            data: {
                name: data.name,
                address: data.address,
                phone: data.phone,
            },
        });
        return toDomain(row);
    }

    async findById(id: string): Promise<Branch | null> {
        const row = await this.prisma.branch.findUnique({ where: { id } });
        return row ? toDomain(row) : null;
    }

    async list(): Promise<Branch[]> {
        const rows = await this.prisma.branch.findMany({
            orderBy: { createdAt: "desc" },
        });
        return rows.map(toDomain);
    }

    async update(id: string, data: BranchUpdate): Promise<Branch> {
        const row = await this.prisma.branch.update({
            where: { id },
            data: {
                name: data.name,
                address: data.address,
                phone: data.phone,
            },
        });
        return toDomain(row);
    }

    async delete(id: string): Promise<Branch> {
        const row = await this.prisma.branch.delete({ where: { id } });
        return toDomain(row);
    }
}
