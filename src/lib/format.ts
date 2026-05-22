export function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatDate(value: string) {
  return new Date(value).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const MENU_CATEGORY_LABELS: Record<string, string> = {
  BEBIDAS: "Bebidas",
  SOBREMESAS: "Sobremesas",
  PRATO_PRINCIPAL: "Prato principal",
  ENTRADAS: "Entradas",
  ACOMPANHAMENTOS: "Acompanhamentos",
};
