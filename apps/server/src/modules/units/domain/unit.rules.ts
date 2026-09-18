export function verifyStringRequest(text: string, campo: string): { isOk: boolean, message: string } {
    if (text !== undefined && (typeof text !== "string" || text.trim() === "")) {
        return { isOk: false, message: `El campo ${campo}, si se manda, debe ser texto no vacío.` }
    }
    return { isOk: true, message: `Ok` }
}