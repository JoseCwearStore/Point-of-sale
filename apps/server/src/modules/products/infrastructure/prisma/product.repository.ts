// infrastructure/prisma/ — aquí, y solo aquí, este módulo sabe que existe Prisma/Postgres.
import { PrismaClient, Product as PrismaProduct } from "@prisma/client";
import { NewProduct, Product, ProductUpdate } from "../../domain/product.entity";
import { ProductRepositoryPort } from "../../ports/product-repository.port";

function toDomain(row: PrismaProduct): Product {
    return {
        id: row.id,
        name: row.name,
        categoryId: row.categoryId,
        unitId: row.unitId,
        hasTax: row.hasTax,
        // row.priceWithoutTax es un Decimal (decimal.js), no un number de JS.
        // Hay que convertirlo explícito, si no el dominio recibe un objeto raro.
        priceWithoutTax: Number(row.priceWithoutTax),
        stock: Number(row.stock),
        imageUrl: row.imageUrl,
        createdAt: row.createdAt,
    };
}

export class PrismaProductRepository implements ProductRepositoryPort {
    constructor(private readonly prisma: PrismaClient) { }

    async create(data: NewProduct): Promise<Product> {
        const row = await this.prisma.product.create({
            data: {
                name: data.name,
                categoryId: data.categoryId,
                unitId: data.unitId,
                hasTax: data.hasTax,
                stock: data.stock,
                priceWithoutTax: data.priceWithoutTax,
                imageUrl: data.imageUrl,
            }
        })
        return toDomain(row);
    }

    async findById(id: string): Promise<Product | null> {
        const row = await this.prisma.product.findUnique({ where: { id } });
        return row ? toDomain(row) : null;
    }

    async list(): Promise<Product[]> {
        const rows = await this.prisma.product.findMany({
            orderBy: { createdAt: "desc" }
        });

        return rows.map(toDomain);
    }

    // "categoryId" y "unitId" no son únicos (muchos productos pueden compartir
    // categoría/unidad), así que aquí no se puede usar findUnique — se usa
    // findFirst: solo necesitamos saber si existe AL MENOS uno.
    async existsByCategoryId(id: string): Promise<Product | null> {
        const row = await this.prisma.product.findFirst({ where: { categoryId: id } });
        return row ? toDomain(row) : null;
    }

    async existsByUnitId(id: string): Promise<Product | null> {
        const row = await this.prisma.product.findFirst({ where: { unitId: id } });
        return row ? toDomain(row) : null;
    }

    async update(id: string, data: ProductUpdate): Promise<Product> {
        const row = await this.prisma.product.update({
            where: { id },
            data: {
                name: data.name,
                categoryId: data.categoryId,
                unitId: data.unitId,
                hasTax: data.hasTax,
                stock: data.stock,
                priceWithoutTax: data.priceWithoutTax,
                imageUrl: data.imageUrl,
            },
        });
        return toDomain(row);
    }

    async delete(id: string): Promise<Product> {
        const row = await this.prisma.product.delete({
            where: { id }
        });
        return toDomain(row);
    }
}
