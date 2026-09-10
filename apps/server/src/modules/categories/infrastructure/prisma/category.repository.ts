// infrastructure/prisma/ — aquí, y solo aquí, este módulo sabe que existe Prisma/Postgres.
import { PrismaClient, Category as PrismaCategory } from "@prisma/client";
import { Category, CategoryToPersist, CategoryUpdate } from "../../domain/category.entity";
import { CategoryRepositoryPort } from "../../ports/category-repository.port";

function toDomain(row: PrismaCategory): Category {
    return {
        id: row.id,
        name: row.name,
        slug: row.slug,
        createdAt: row.createdAt,
    };
}

export class PrismaCategoryRepository implements CategoryRepositoryPort {
    constructor(private readonly prisma: PrismaClient) { }

    async create(data: CategoryToPersist): Promise<Category> {
        const row = await this.prisma.category.create({
            data: {
                name: data.name,
                slug: data.slug
            }
        })
        return toDomain(row);
    }

    async findBySlug(slug: string): Promise<Category | null> {
        const row = await this.prisma.category.findUnique({ where: { slug } });
        return row ? toDomain(row) : null;
    }

    async findById(id: string): Promise<Category | null> {
        const row = await this.prisma.category.findUnique({ where: { id } });
        return row ? toDomain(row) : null;
    }

    async list(): Promise<Category[]> {
        const rows = await this.prisma.category.findMany({
            orderBy: { createdAt: "desc" }
        });

        return rows.map(toDomain);
    }

    async update(id: string, data: CategoryUpdate): Promise<Category> {
        const row = await this.prisma.category.update({
            where: { id },
            data: {
                name: data.name,
                slug: data.slug,
            },
        });
        return toDomain(row);
    }
}