// infrastructure/prisma/ — aquí, y solo aquí, este módulo sabe que existe Prisma/Postgres.
import { PrismaClient, Unit as PrismaUnit } from "@prisma/client";
import { NewUnit, Unit, UnitUpdate } from "../../domain/unit.entity";
import { UnitRepositoryPort } from "../../ports/unit-repository.port";

function toDomain(row: PrismaUnit): Unit {
    return {
        id: row.id,
        name: row.name,
        abbreviation: row.abbreviation,
        createdAt: row.createdAt,
    };
}

export class PrismaUnitRepository implements UnitRepositoryPort {
    constructor(private readonly prisma: PrismaClient) { }

    async create(data: NewUnit): Promise<Unit> {
        const row = await this.prisma.unit.create({
            data: {
                name: data.name,
                abbreviation: data.abbreviation
            }
        })
        return toDomain(row);
    }

    async findById(id: string): Promise<Unit | null> {
        const row = await this.prisma.unit.findUnique({ where: { id } });
        return row ? toDomain(row) : null;
    }

    async list(): Promise<Unit[]> {
        const rows = await this.prisma.unit.findMany({
            orderBy: { createdAt: "desc" }
        });

        return rows.map(toDomain);
    }

    async update(id: string, data: UnitUpdate): Promise<Unit> {
        const row = await this.prisma.unit.update({
            where: { id },
            data: {
                name: data.name,
                abbreviation: data.abbreviation,
            },
        });
        return toDomain(row);
    }

    async delete(id: string): Promise<Unit> {
        const row = await this.prisma.unit.delete({
            where: { id }
        });
        return toDomain(row);
    }
}