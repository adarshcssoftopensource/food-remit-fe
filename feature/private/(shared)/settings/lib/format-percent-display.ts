export function formatPercentDisplay(liveValue: string, currentValue: string) {
  const numericValue = parseFloat(liveValue);
  const isValid = !isNaN(numericValue) && numericValue >= 0 && numericValue <= 100;

  const rawDisplayValue = isValid ? liveValue || currentValue : currentValue;
  return rawDisplayValue ? (Math.round(parseFloat(rawDisplayValue) * 100) / 100).toString() : "0";
}
