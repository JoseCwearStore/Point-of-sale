import { ValidationError } from "../../../shared/errors";
import { SaleItem } from "./sale.entity";
interface SaleTotals {
    subtotal: number;
    tax: number;
    total: number
}

export function assertValidQuantity(quantity: number): void {
    if (isNaN(quantity)) {
        throw new ValidationError("La cantidad debe ser un número válido.");
    }
    if (quantity <= 0) {
        throw new ValidationError("La cantidad debe ser mayor a 0.");
    }
}

export function computeSaleTotals(items: SaleItem[]): SaleTotals {
    const salesValues: SaleTotals = {
        subtotal: 0,
        total: 0,
        tax: 0
    }
    items.forEach((val: SaleItem) => {
        salesValues.total += val.lineTotal;
        salesValues.subtotal += (val.unitPriceWithoutTax * val.quantity);
    });
    salesValues.tax = salesValues.total - salesValues.subtotal;
    return salesValues;
}

export function assertPaymentsMatchTotal(payments: { amount: number }[], total: number): void {
    let paymentsAmount: number = 0;
    payments.forEach((val) => paymentsAmount += val.amount);
    if (Math.abs(paymentsAmount - total) > 0.01) throw new ValidationError("La suma de los pagos difiere con el total de la venta.");
}