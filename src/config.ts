export interface SpTableLocale {
  searchPlaceholder: string;
  empty: string;
  filteredEmpty: string;
  clearFilters: string;
  loading: string;
  rowsLabel: string;
  columnsLabel: string;
  filterLabel: string; // "Filter: {col}" — use {col} placeholder
  actionsLabel: string;
  selectedRows: string; // "{n} selected"
  ofTotal: string; // "of {total}"
}

export interface SpLocale {
  table: SpTableLocale;
}

const defaultLocale: SpLocale = {
  table: {
    searchPlaceholder: "Search all columns…",
    empty: "No data available",
    filteredEmpty: "No results match the current filters.",
    clearFilters: "Clear filters",
    loading: "Loading…",
    rowsLabel: "Rows:",
    columnsLabel: "Columns",
    filterLabel: "Filter: {col}",
    actionsLabel: "Actions",
    selectedRows: "{n} selected",
    ofTotal: "of {total}",
  },
};

class SpConfigManager {
  private _locale: SpLocale = structuredClone(defaultLocale);

  get locale(): SpLocale {
    return this._locale;
  }

  setLocale(partial: DeepPartial<SpLocale>): void {
    this._locale = deepMerge(
      defaultLocale as unknown as Record<string, unknown>,
      partial as unknown as Record<string, unknown>,
    ) as unknown as SpLocale;
  }

  reset(): void {
    this._locale = structuredClone(defaultLocale);
  }
}

type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] };

function deepMerge(target: Record<string, unknown>, source: Record<string, unknown>): Record<string, unknown> {
  const result = { ...target };
  for (const key in source) {
    const sv = source[key];
    if (sv && typeof sv === "object" && !Array.isArray(sv)) {
      result[key] = deepMerge((target[key] as Record<string, unknown>) ?? {}, sv as Record<string, unknown>);
    } else if (sv !== undefined) {
      result[key] = sv;
    }
  }
  return result;
}

export const SpConfig = new SpConfigManager();
