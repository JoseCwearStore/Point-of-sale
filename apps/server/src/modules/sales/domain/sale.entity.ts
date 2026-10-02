export type PaymentMethod = "EFECTIVO" | "TARJETA" | "TRANSFERENCIA";
export type SaleStatus = "ACTIVA" | "CANCELADA";

export interface SalePayment {
    id: string,
    saleId: string,
    method: PaymentMethod,
    amount: number,
    amountReceived: number | null;
}

export interface SaleItem {
    id: string,
    saleId: string,
    productId: string,
    quantity: number
    // foto de la venta
    unitPriceWithoutTax: number,
    hasTax: boolean,
    unitPriceWithTax: number,
    lineTotal: number
}

export interface Sale {
    id: string,
    branchId: string,
    status: SaleStatus,
    subtotal: number,
    tax: number,
    total: number,
    createdAt: Date,
    items: SaleItem[],
    payments: SalePayment[]
}

export type NewSaleRecord = {
    branchId: string;
    status: SaleStatus;
    subtotal: number;
    tax: number;
    total: number;
    items: Omit<SaleItem, "id" | "saleId">[];
    payments: Omit<SalePayment, "id" | "saleId">[];
};

export interface NewSale {
    branchId: Sale["branchId"]; // o simplemente: string
    items: NewSaleItemInput[];
    payments: NewSalePaymentInput[];
}

export type NewSaleItemInput = Pick<SaleItem, "productId" | "quantity">;

export type NewSalePaymentInput = Pick<SalePayment, "method" | "amount"> &
    Partial<Pick<SalePayment, "amountReceived">>;