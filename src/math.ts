export const sum = (a: number, b: number) => a + b;

export function divide(a: number, b: number) {
  if (b === 0) throw new Error('No se puede dividir por cero');
  return a / b;
}
