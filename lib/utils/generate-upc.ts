/**
 * Generates a valid UPC-A (UPC-12) barcode string.
 * Produces 11 random digits then appends the standard check digit.
 */
export function generateUpcCode(): string {
  const digits = Array.from({ length: 11 }, () => Math.floor(Math.random() * 10));
  const checkDigit =
    (10 - (digits.reduce((sum, d, i) => sum + d * (i % 2 === 0 ? 3 : 1), 0) % 10)) % 10;
  return [...digits, checkDigit].join("");
}
