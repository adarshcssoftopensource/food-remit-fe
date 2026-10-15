/**
 * Utility to export an array of objects to Excel-compatible CSV with UTF-8 BOM
 */
export function exportToExcel<T = Record<string, unknown>>(
  filename: string,
  data: T[],
  headers: {
    label: string;
    key: keyof T | (string & {}) | ((item: T, index: number) => unknown);
  }[],
) {
  if (!data || data.length === 0) return;

  const headerRow = headers.map((h) => `"${h.label.replace(/"/g, '""')}"`).join(",");

  const rows = data.map((item, index) => {
    return headers
      .map((h) => {
        let val =
          typeof h.key === "function"
            ? h.key(item, index)
            : (item as Record<string | number | symbol, unknown>)[h.key];
        if (val === null || val === undefined) val = "";
        const strVal = String(val).replace(/"/g, '""');
        return `"${strVal}"`;
      })
      .join(",");
  });

  const csvContent = "\uFEFF" + [headerRow, ...rows].join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
