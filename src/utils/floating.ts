import {
  computePosition,
  flip,
  shift,
  offset,
  arrow,
  autoUpdate,
  type Placement,
  type MiddlewareData,
} from "@floating-ui/dom";

export type { Placement };

export interface FloatingConfig {
  /** The reference element (trigger) */
  reference: HTMLElement;
  /** The floating element (popover / tooltip / dropdown) */
  floating: HTMLElement;
  /** Preferred placement — floating-ui will flip if needed */
  placement: Placement;
  /** Gap in px between reference and floating element (default: 8) */
  distance?: number;
  /** Arrow element to position (optional) */
  arrowEl?: HTMLElement | null;
  /** When true, the floating element width is set to match the reference width (useful for dropdowns) */
  matchWidth?: boolean;
  /** Called after each position update */
  onUpdate?: (placement: Placement, middlewareData: MiddlewareData) => void;
}

/**
 * Sets up automatic floating position tracking.
 * Returns a cleanup function — call it in disconnectedCallback().
 *
 * @example
 * ```ts
 * #cleanupFloating?: () => void;
 *
 * override connectedCallback() {
 *   super.connectedCallback();
 *   this.#cleanupFloating = setupFloating({
 *     reference: this,
 *     floating: this.shadowRoot!.querySelector('.sp-popover')!,
 *     placement: this.placement,
 *     distance: this.distance,
 *   });
 * }
 *
 * override disconnectedCallback() {
 *   super.disconnectedCallback();
 *   this.#cleanupFloating?.();
 * }
 * ```
 */
export function setupFloating(config: FloatingConfig): () => void {
  const { reference, floating, distance = 8, arrowEl, matchWidth, onUpdate } = config;
  let placement = config.placement;

  const update = async () => {
    const middleware = [
      offset(distance),
      flip({ fallbackAxisSideDirection: "start" }),
      shift({ padding: 8 }),
      ...(arrowEl ? [arrow({ element: arrowEl })] : []),
    ];

    const result = await computePosition(reference, floating, {
      placement,
      middleware,
    });

    // Apply position
    Object.assign(floating.style, {
      position: "absolute",
      left: `${result.x}px`,
      top: `${result.y}px`,
    });

    // Match reference width when requested (for dropdowns)
    if (matchWidth) {
      floating.style.width = `${reference.offsetWidth}px`;
    }

    // Update data-placement attribute for CSS arrow styling
    floating.dataset["placement"] = result.placement;

    // Position arrow if present
    if (arrowEl && result.middlewareData.arrow) {
      const { x: ax, y: ay } = result.middlewareData.arrow;
      const side = result.placement.split("-")[0]!;
      const staticSide = { top: "bottom", right: "left", bottom: "top", left: "right" }[side] ?? "bottom";

      Object.assign(arrowEl.style, {
        left: ax != null ? `${ax}px` : "",
        top: ay != null ? `${ay}px` : "",
        right: "",
        bottom: "",
        [staticSide]: "-5px",
      });
    }

    placement = result.placement;
    onUpdate?.(result.placement, result.middlewareData);
  };

  // autoUpdate recomputes on scroll, resize, and DOM mutations
  const cleanup = autoUpdate(reference, floating, update);
  return cleanup;
}

/**
 * One-shot position update (no auto-tracking).
 * Useful when the floating element is shown/hidden without reconnecting.
 */
export async function updateFloating(config: Omit<FloatingConfig, "onUpdate">): Promise<Placement> {
  const { reference, floating, distance = 8, arrowEl } = config;
  let placement = config.placement;

  const middleware = [
    offset(distance),
    flip({ fallbackAxisSideDirection: "start" }),
    shift({ padding: 8 }),
    ...(arrowEl ? [arrow({ element: arrowEl })] : []),
  ];

  const result = await computePosition(reference, floating, { placement, middleware });

  Object.assign(floating.style, {
    position: "absolute",
    left: `${result.x}px`,
    top: `${result.y}px`,
  });

  floating.dataset["placement"] = result.placement;

  if (arrowEl && result.middlewareData.arrow) {
    const { x: ax, y: ay } = result.middlewareData.arrow;
    const side = result.placement.split("-")[0]!;
    const staticSide = { top: "bottom", right: "left", bottom: "top", left: "right" }[side] ?? "bottom";
    Object.assign(arrowEl.style, {
      left: ax != null ? `${ax}px` : "",
      top: ay != null ? `${ay}px` : "",
      right: "",
      bottom: "",
      [staticSide]: "-5px",
    });
  }

  placement = result.placement;
  return placement;
}
