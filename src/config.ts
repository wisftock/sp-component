/* ===================================================
 * SP Components — Global Configuration
 * SpConfig is a singleton used across all components.
 * ===================================================*/

// ─── Locale interfaces ─────────────────────────────────────────────────────

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

export interface SpCommonLocale {
  close: string;
  clear: string;
  cancel: string;
  confirm: string;
  remove: string;
  loading: string;
  dismiss: string;
}

export interface SpModalLocale {
  closeLabel: string;
}

export interface SpAlertLocale {
  closeLabel: string;
}

export interface SpAutocompleteLocale {
  clearLabel: string;
  /** "Open" / "Close" label for the toggle button */
  openLabel: string;
  closeLabel: string;
  /** Supports {label} placeholder */
  removeLabel: string;
}

export interface SpComboboxLocale {
  clearLabel: string;
  /** Supports {label} placeholder */
  removeLabel: string;
}

export interface SpInputLocale {
  clearLabel: string;
}

export interface SpFileUploadLocale {
  removeFileLabel: string;
}

export interface SpInlineEditLocale {
  confirmLabel: string;
  cancelLabel: string;
}

export interface SpNumberInputLocale {
  decreaseLabel: string;
  increaseLabel: string;
}

export interface SpPaginationLocale {
  paginationLabel: string;
  firstPageLabel: string;
  prevPageLabel: string;
  nextPageLabel: string;
  lastPageLabel: string;
}

export interface SpRatingLocale {
  clearLabel: string;
}

export interface SpBreadcrumbLocale {
  navLabel: string;
  expandLabel: string;
}

export interface SpCalendarLocale {
  prevMonthLabel: string;
  nextMonthLabel: string;
  prevYearLabel: string;
  nextYearLabel: string;
  prevYearsLabel: string;
  nextYearsLabel: string;
  calendarLabel: string;
  selectDatePlaceholder: string;
}

export interface SpCarouselLocale {
  prevSlideLabel: string;
  nextSlideLabel: string;
  slideNavLabel: string;
  /** Supports {index} and {total} placeholders */
  slideLabel: string;
}

export interface SpGalleryLocale {
  closeLightboxLabel: string;
  prevImageLabel: string;
  nextImageLabel: string;
  imageNavLabel: string;
  imageViewerLabel: string;
  galleryLabel: string;
}

export interface SpTabsLocale {
  closeTabLabel: string;
  scrollLeftLabel: string;
  scrollRightLabel: string;
}

export interface SpTimePickerLocale {
  clearLabel: string;
  panelLabel: string;
  increaseHoursLabel: string;
  decreaseHoursLabel: string;
  increaseMinutesLabel: string;
  decreaseMinutesLabel: string;
  increaseSecondsLabel: string;
  decreaseSecondsLabel: string;
  toggleAmPmLabel: string;
  presetsLabel: string;
}

export interface SpColorPickerLocale {
  pickerLabel: string;
  hueLabel: string;
  alphaLabel: string;
  valueLabel: string;
}

export interface SpCommandPaletteLocale {
  paletteLabel: string;
  loadingText: string;
}

export interface SpSliderLocale {
  rangeStartLabel: string;
  rangeEndLabel: string;
}

export interface SpSplitPanelLocale {
  resizeHandleLabel: string;
}

export interface SpBadgeLocale {
  removeLabel: string;
}

export interface SpTagLocale {
  removeLabel: string;
}

export interface SpTagInputLocale {
  /** Supports {tag} placeholder */
  removeTagLabel: string;
}

export interface SpToastLocale {
  closeLabel: string;
  dismissLabel: string;
  notificationsLabel: string;
}

export interface SpTreeLocale {
  loadingLabel: string;
}

export interface SpNotificationCenterLocale {
  markAllReadLabel: string;
  dismissLabel: string;
  noNotificationsText: string;
  notificationsLabel: string;
}

export interface SpBottomSheetLocale {
  closeLabel: string;
}

export interface SpKanbanLocale {
  addCardLabel: string;
  addConfirmLabel: string;
  addCancelLabel: string;
  addPlaceholder: string;
  wipLimitLabel: string; // "Limit: {n}" — use {n} placeholder
}

export interface SpOnboardingLocale {
  skipLabel: string;
  nextLabel: string;
  prevLabel: string;
  /** Supports {current} and {total} placeholders */
  stepLabel: string;
}

export interface SpTourLocale {
  /** Supports {current} and {total} placeholders */
  stepBadgeLabel: string;
  nextLabel: string;
  prevLabel: string;
  finishLabel: string;
  closeLabel: string;
}

export interface SpTransferLocale {
  sourceTitleLabel: string;
  targetTitleLabel: string;
  searchPlaceholder: string;
  moveAllLabel: string;
  removeAllLabel: string;
}

export interface SpSignatureLocale {
  undoLabel: string;
  clearLabel: string;
  penWidthLabel: string; // "Pen width: {n}px" — use {n} placeholder
}

export interface SpDrawerLocale {
  closeLabel: string;
  loadingLabel: string;
}

export interface SpLightboxLocale {
  closeLabel: string;
  prevLabel: string;
  nextLabel: string;
  zoomInLabel: string;
  zoomOutLabel: string;
}

export interface SpCodeBlockLocale {
  copyLabel: string;
  copiedLabel: string;
}

export interface SpSearchInputLocale {
  placeholder: string;
  clearLabel: string;
}

export interface SpPasswordInputLocale {
  showLabel: string;
  hideLabel: string;
}

export interface SpFloatingPanelLocale {
  expandLabel: string;
  collapseLabel: string;
  closeLabel: string;
}

export interface SpMonthPickerLocale {
  prevYearLabel: string;
  nextYearLabel: string;
  monthsShort: string[];
  monthsFull: string[];
}

export interface SpAudioPlayerLocale {
  speedLabel: string;
}

export interface SpImageCompareLocale {
  beforeLabel: string;
  afterLabel: string;
}

export interface SpLocale {
  table: SpTableLocale;
  common: SpCommonLocale;
  modal: SpModalLocale;
  alert: SpAlertLocale;
  autocomplete: SpAutocompleteLocale;
  combobox: SpComboboxLocale;
  input: SpInputLocale;
  fileUpload: SpFileUploadLocale;
  inlineEdit: SpInlineEditLocale;
  numberInput: SpNumberInputLocale;
  pagination: SpPaginationLocale;
  rating: SpRatingLocale;
  breadcrumb: SpBreadcrumbLocale;
  calendar: SpCalendarLocale;
  carousel: SpCarouselLocale;
  gallery: SpGalleryLocale;
  tabs: SpTabsLocale;
  timePicker: SpTimePickerLocale;
  colorPicker: SpColorPickerLocale;
  commandPalette: SpCommandPaletteLocale;
  slider: SpSliderLocale;
  splitPanel: SpSplitPanelLocale;
  badge: SpBadgeLocale;
  tag: SpTagLocale;
  tagInput: SpTagInputLocale;
  toast: SpToastLocale;
  tree: SpTreeLocale;
  notificationCenter: SpNotificationCenterLocale;
  bottomSheet: SpBottomSheetLocale;
  kanban: SpKanbanLocale;
  onboarding: SpOnboardingLocale;
  tour: SpTourLocale;
  transfer: SpTransferLocale;
  signature: SpSignatureLocale;
  drawer: SpDrawerLocale;
  lightbox: SpLightboxLocale;
  codeBlock: SpCodeBlockLocale;
  searchInput: SpSearchInputLocale;
  passwordInput: SpPasswordInputLocale;
  floatingPanel: SpFloatingPanelLocale;
  monthPicker: SpMonthPickerLocale;
  audioPlayer: SpAudioPlayerLocale;
  imageCompare: SpImageCompareLocale;
}

// ─── Default locale (English) ──────────────────────────────────────────────

const defaultLocale: SpLocale = {
  common: {
    close: "Close",
    clear: "Clear",
    cancel: "Cancel",
    confirm: "Confirm",
    remove: "Remove",
    loading: "Loading",
    dismiss: "Dismiss",
  },
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
  modal: { closeLabel: "Close dialog" },
  alert: { closeLabel: "Close" },
  autocomplete: {
    clearLabel: "Clear",
    openLabel: "Open",
    closeLabel: "Close",
    removeLabel: "Remove {label}",
  },
  combobox: {
    clearLabel: "Clear",
    removeLabel: "Remove {label}",
  },
  input: { clearLabel: "Clear" },
  fileUpload: { removeFileLabel: "Remove file" },
  inlineEdit: { confirmLabel: "Confirm", cancelLabel: "Cancel" },
  numberInput: { decreaseLabel: "Decrease", increaseLabel: "Increase" },
  pagination: {
    paginationLabel: "Pagination",
    firstPageLabel: "First page",
    prevPageLabel: "Previous page",
    nextPageLabel: "Next page",
    lastPageLabel: "Last page",
  },
  rating: { clearLabel: "Clear rating" },
  breadcrumb: {
    navLabel: "breadcrumb",
    expandLabel: "Show all breadcrumbs",
  },
  calendar: {
    prevMonthLabel: "Previous month",
    nextMonthLabel: "Next month",
    prevYearLabel: "Previous year",
    nextYearLabel: "Next year",
    prevYearsLabel: "Previous years",
    nextYearsLabel: "Next years",
    calendarLabel: "Calendar",
    selectDatePlaceholder: "Select date",
  },
  carousel: {
    prevSlideLabel: "Previous slide",
    nextSlideLabel: "Next slide",
    slideNavLabel: "Slide navigation",
    slideLabel: "Slide {index} of {total}",
  },
  gallery: {
    closeLightboxLabel: "Close lightbox",
    prevImageLabel: "Previous image",
    nextImageLabel: "Next image",
    imageNavLabel: "Image navigation",
    imageViewerLabel: "Image viewer",
    galleryLabel: "Image gallery",
  },
  tabs: {
    closeTabLabel: "Close tab",
    scrollLeftLabel: "Scroll tabs left",
    scrollRightLabel: "Scroll tabs right",
  },
  timePicker: {
    clearLabel: "Clear time",
    panelLabel: "Time picker",
    increaseHoursLabel: "Increase hours",
    decreaseHoursLabel: "Decrease hours",
    increaseMinutesLabel: "Increase minutes",
    decreaseMinutesLabel: "Decrease minutes",
    increaseSecondsLabel: "Increase seconds",
    decreaseSecondsLabel: "Decrease seconds",
    toggleAmPmLabel: "Toggle AM/PM",
    presetsLabel: "Quick time options",
  },
  colorPicker: {
    pickerLabel: "Color picker",
    hueLabel: "Hue",
    alphaLabel: "Alpha",
    valueLabel: "Color value",
  },
  commandPalette: {
    paletteLabel: "Command palette",
    loadingText: "Loading...",
  },
  slider: {
    rangeStartLabel: "Range start",
    rangeEndLabel: "Range end",
  },
  splitPanel: { resizeHandleLabel: "Resize handle" },
  badge: { removeLabel: "Remove" },
  tag: { removeLabel: "Remove" },
  tagInput: { removeTagLabel: "Remove {tag}" },
  toast: {
    closeLabel: "Close",
    dismissLabel: "Dismiss notification",
    notificationsLabel: "Notifications",
  },
  tree: { loadingLabel: "Loading" },
  notificationCenter: {
    markAllReadLabel: "Mark all read",
    dismissLabel: "Dismiss",
    noNotificationsText: "No notifications",
    notificationsLabel: "Notifications",
  },
  bottomSheet: { closeLabel: "Close" },
  kanban: {
    addCardLabel: "Add card",
    addConfirmLabel: "Add",
    addCancelLabel: "Cancel",
    addPlaceholder: "Card title…",
    wipLimitLabel: "Limit: {n}",
  },
  onboarding: {
    skipLabel: "Skip",
    nextLabel: "Next",
    prevLabel: "Back",
    stepLabel: "{current} of {total}",
  },
  tour: {
    stepBadgeLabel: "Step {current} of {total}",
    nextLabel: "Next",
    prevLabel: "Previous",
    finishLabel: "Finish",
    closeLabel: "Close tour",
  },
  transfer: {
    sourceTitleLabel: "Source",
    targetTitleLabel: "Target",
    searchPlaceholder: "Search…",
    moveAllLabel: "Move all",
    removeAllLabel: "Remove all",
  },
  signature: {
    undoLabel: "Undo last stroke",
    clearLabel: "Clear signature",
    penWidthLabel: "Pen width: {n}px",
  },
  drawer: {
    closeLabel: "Close",
    loadingLabel: "Loading",
  },
  lightbox: {
    closeLabel: "Close",
    prevLabel: "Previous image",
    nextLabel: "Next image",
    zoomInLabel: "Zoom in",
    zoomOutLabel: "Zoom out",
  },
  codeBlock: {
    copyLabel: "Copy code",
    copiedLabel: "Copied!",
  },
  searchInput: {
    placeholder: "Search...",
    clearLabel: "Clear search",
  },
  passwordInput: {
    showLabel: "Show password",
    hideLabel: "Hide password",
  },
  floatingPanel: {
    expandLabel: "Expand",
    collapseLabel: "Collapse",
    closeLabel: "Close",
  },
  monthPicker: {
    prevYearLabel: "Previous year",
    nextYearLabel: "Next year",
    monthsShort: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
    monthsFull: ["January","February","March","April","May","June","July","August","September","October","November","December"],
  },
  audioPlayer: {
    speedLabel: "Speed",
  },
  imageCompare: {
    beforeLabel: "Before",
    afterLabel: "After",
  },
};

// ─── Theming types ─────────────────────────────────────────────────────────

export type SpPresetTheme = "default" | "violet" | "rose" | "emerald" | "amber" | "slate";

export type SpColorScheme = "light" | "dark" | "auto";

export type SpDensity = "compact" | "comfortable" | "spacious";

/** Custom theme: provide full CSS variable names (--sp-*) or shorthand token keys */
export type SpThemeTokens = Partial<Record<`--sp-${string}`, string>>;

// ─── Config Manager ────────────────────────────────────────────────────────

class SpConfigManager {
  private _locale: SpLocale = structuredClone(defaultLocale);

  // ── Locale ──────────────────────────────────────────────────────────────

  get locale(): SpLocale {
    return this._locale;
  }

  setLocale(partial: DeepPartial<SpLocale>): void {
    this._locale = deepMerge(
      defaultLocale as unknown as Record<string, unknown>,
      partial as unknown as Record<string, unknown>,
    ) as unknown as SpLocale;
  }

  resetLocale(): void {
    this._locale = structuredClone(defaultLocale);
  }

  reset(): void {
    this._locale = structuredClone(defaultLocale);
    this.setColorScheme("auto");
    this.setDensity("comfortable");
  }

  // ── Theming ─────────────────────────────────────────────────────────────

  setTheme(theme: SpPresetTheme | SpThemeTokens): void {
    const tokens: SpThemeTokens =
      typeof theme === "string" ? presetThemes[theme] : theme;
    const root = document.documentElement;
    for (const [key, value] of Object.entries(tokens)) {
      root.style.setProperty(key, value ?? null);
    }
  }

  resetTheme(): void {
    const root = document.documentElement;
    for (const key of Object.keys(presetThemes.default)) {
      root.style.removeProperty(key);
    }
  }

  // ── Color scheme ────────────────────────────────────────────────────────

  setColorScheme(scheme: SpColorScheme): void {
    const root = document.documentElement;
    if (scheme === "auto") {
      root.removeAttribute("data-sp-scheme");
    } else {
      root.setAttribute("data-sp-scheme", scheme);
    }
  }

  // ── Density ─────────────────────────────────────────────────────────────

  setDensity(density: SpDensity): void {
    const root = document.documentElement;
    if (density === "comfortable") {
      root.removeAttribute("data-sp-density");
    } else {
      root.setAttribute("data-sp-density", density);
    }
  }
}

// ─── Preset themes ─────────────────────────────────────────────────────────

const presetThemes: Record<SpPresetTheme, SpThemeTokens> = {
  default: {
    "--sp-primary": "#3b82f6",
    "--sp-primary-hover": "#2563eb",
    "--sp-primary-active": "#1d4ed8",
    "--sp-primary-bg": "#eff6ff",
    "--sp-primary-bg-hover": "#dbeafe",
    "--sp-primary-focus": "rgba(59, 130, 246, 0.2)",
  },
  violet: {
    "--sp-primary": "#7c3aed",
    "--sp-primary-hover": "#6d28d9",
    "--sp-primary-active": "#5b21b6",
    "--sp-primary-bg": "#f5f3ff",
    "--sp-primary-bg-hover": "#ede9fe",
    "--sp-primary-focus": "rgba(124, 58, 237, 0.2)",
  },
  rose: {
    "--sp-primary": "#e11d48",
    "--sp-primary-hover": "#be123c",
    "--sp-primary-active": "#9f1239",
    "--sp-primary-bg": "#fff1f2",
    "--sp-primary-bg-hover": "#ffe4e6",
    "--sp-primary-focus": "rgba(225, 29, 72, 0.2)",
  },
  emerald: {
    "--sp-primary": "#059669",
    "--sp-primary-hover": "#047857",
    "--sp-primary-active": "#065f46",
    "--sp-primary-bg": "#ecfdf5",
    "--sp-primary-bg-hover": "#d1fae5",
    "--sp-primary-focus": "rgba(5, 150, 105, 0.2)",
  },
  amber: {
    "--sp-primary": "#d97706",
    "--sp-primary-hover": "#b45309",
    "--sp-primary-active": "#92400e",
    "--sp-primary-bg": "#fffbeb",
    "--sp-primary-bg-hover": "#fef3c7",
    "--sp-primary-focus": "rgba(217, 119, 6, 0.2)",
  },
  slate: {
    "--sp-primary": "#475569",
    "--sp-primary-hover": "#334155",
    "--sp-primary-active": "#1e293b",
    "--sp-primary-bg": "#f8fafc",
    "--sp-primary-bg-hover": "#f1f5f9",
    "--sp-primary-focus": "rgba(71, 85, 105, 0.2)",
  },
};

// ─── Utilities ─────────────────────────────────────────────────────────────

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

// ─── Singleton export ───────────────────────────────────────────────────────

export const SpConfig = new SpConfigManager();
