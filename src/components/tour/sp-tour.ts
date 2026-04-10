import { LitElement, html, unsafeCSS, nothing, svg } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import styles from "./sp-tour.css?inline";
import { SpConfig } from "../../config.js";

export interface SpTourStep {
  target: string;        // CSS selector for the element to highlight
  title?: string;
  content: string;
  placement?: "top" | "bottom" | "left" | "right";
}

/**
 * Guided tour / onboarding component.
 * Highlights DOM elements and shows a tooltip with navigation.
 *
 * @element sp-tour
 *
 * @prop {SpTourStep[]} steps   - Array of tour steps
 * @prop {boolean}      active  - Whether the tour is running
 * @prop {number}       step    - Current step index (0-based)
 *
 * @fires {CustomEvent<{ step: number }>}             sp-step-change - Step changed
 * @fires {CustomEvent}                               sp-finish      - Tour finished
 * @fires {CustomEvent}                               sp-skip        - Tour skipped
 *
 * @example
 * const tour = document.querySelector("sp-tour");
 * tour.steps = [
 *   { target: "#save-btn", title: "Save your work", content: "Click here to save." },
 *   { target: "#settings", title: "Settings", content: "Configure the app here." },
 * ];
 * tour.active = true;
 */
@customElement("sp-tour")
export class SpTourComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: Array })
  steps: SpTourStep[] = [];

  @property({ type: Boolean, reflect: true })
  active = false;

  @property({ type: Number })
  step = 0;

  @state() private _targetRect: DOMRect | null = null;

  #resizeObserver: ResizeObserver | null = null;

  override updated(changed: Map<string, unknown>) {
    if (changed.has("active") || changed.has("step")) {
      if (this.active) {
        this.#updateRect();
        this.#startObserving();
      } else {
        this.#stopObserving();
      }
    }
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.#stopObserving();
  }

  #getTargetEl(): Element | null {
    const step = this.steps[this.step];
    if (!step) return null;
    return document.querySelector(step.target);
  }

  #updateRect() {
    const el = this.#getTargetEl();
    if (!el) { this._targetRect = null; return; }
    this._targetRect = el.getBoundingClientRect();
    el.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }

  #startObserving() {
    this.#stopObserving();
    this.#resizeObserver = new ResizeObserver(() => this.#updateRect());
    const el = this.#getTargetEl();
    if (el) this.#resizeObserver.observe(el);
    window.addEventListener("resize", this.#handleResize);
    window.addEventListener("scroll", this.#handleResize, true);
    document.addEventListener("keydown", this.#handleKeyDown);
  }

  #stopObserving() {
    this.#resizeObserver?.disconnect();
    this.#resizeObserver = null;
    window.removeEventListener("resize", this.#handleResize);
    window.removeEventListener("scroll", this.#handleResize, true);
    document.removeEventListener("keydown", this.#handleKeyDown);
  }

  readonly #handleResize = () => this.#updateRect();

  readonly #handleKeyDown = (e: KeyboardEvent) => {
    if (!this.active) return;
    if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === "Enter") {
      e.preventDefault(); this.#next();
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault(); this.#prev();
    } else if (e.key === "Escape") {
      e.preventDefault(); this.#skip();
    }
  };

  #next() {
    if (this.step < this.steps.length - 1) {
      this.step++;
      this.dispatchEvent(new CustomEvent("sp-step-change", { detail: { step: this.step }, bubbles: true, composed: true }));
    } else {
      this.#finish();
    }
  }

  #prev() {
    if (this.step > 0) {
      this.step--;
      this.dispatchEvent(new CustomEvent("sp-step-change", { detail: { step: this.step }, bubbles: true, composed: true }));
    }
  }

  #finish() {
    this.active = false;
    this.step = 0;
    this.dispatchEvent(new CustomEvent("sp-finish", { bubbles: true, composed: true }));
  }

  #skip() {
    this.active = false;
    this.step = 0;
    this.dispatchEvent(new CustomEvent("sp-skip", { bubbles: true, composed: true }));
  }

  #getTooltipPosition(rect: DOMRect, placement: string): Record<string, string> {
    const GAP = 12;
    const W = window.innerWidth;
    const H = window.innerHeight;

    if (placement === "top" || (placement !== "bottom" && placement !== "left" && placement !== "right" && rect.top > 240)) {
      return { bottom: (H - rect.top + GAP) + "px", left: Math.min(Math.max(8, rect.left), W - 340) + "px" };
    }
    if (placement === "left") {
      return { top: Math.max(8, rect.top) + "px", right: (W - rect.left + GAP) + "px" };
    }
    if (placement === "right") {
      return { top: Math.max(8, rect.top) + "px", left: (rect.right + GAP) + "px" };
    }
    // default: bottom
    return { top: (rect.bottom + GAP) + "px", left: Math.min(Math.max(8, rect.left), W - 340) + "px" };
  }

  #renderOverlaySVG(rect: DOMRect) {
    const W = window.innerWidth;
    const H = window.innerHeight;
    const PAD = 6;
    const r = rect;
    const x = r.left - PAD, y = r.top - PAD;
    const w = r.width + PAD * 2, h = r.height + PAD * 2;
    const br = 6;

    // Cutout path: full screen minus rounded rect around target
    const path = `M0,0 H${W} V${H} H0 Z
      M${x + br},${y} H${x + w - br} Q${x + w},${y} ${x + w},${y + br}
      V${y + h - br} Q${x + w},${y + h} ${x + w - br},${y + h}
      H${x + br} Q${x},${y + h} ${x},${y + h - br}
      V${y + br} Q${x},${y} ${x + br},${y} Z`;

    return svg`
      <svg class="sp-tour-svg" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
        <path d=${path} fill="rgba(0,0,0,0.45)" fill-rule="evenodd"/>
      </svg>
    `;
  }

  override render() {
    if (!this.active || this.steps.length === 0) return nothing;

    const currentStep = this.steps[this.step];
    if (!currentStep) return nothing;

    const rect = this._targetRect;
    const placement = currentStep.placement ?? "bottom";
    const tooltipPos = rect ? this.#getTooltipPosition(rect, placement) : { top: "50%", left: "50%", transform: "translate(-50%,-50%)" };

    return html`
      <!-- Overlay with cutout -->
      <div class="sp-tour-overlay" aria-hidden="true">
        ${rect ? this.#renderOverlaySVG(rect) : nothing}
      </div>

      <!-- Highlight ring -->
      ${rect ? html`
        <div class="sp-tour-highlight" style=${styleMap({
          top: (rect.top - 6) + "px",
          left: (rect.left - 6) + "px",
          width: (rect.width + 12) + "px",
          height: (rect.height + 12) + "px",
        })}></div>
      ` : nothing}

      <!-- Tooltip -->
      <div class="sp-tour-tooltip" role="dialog" aria-label="Tour step ${this.step + 1}" style=${styleMap(tooltipPos)}>
        <button class="sp-tour-close" aria-label=${SpConfig.locale.tour.closeLabel} @click=${() => this.#skip()}>✕</button>

        <div class="sp-tour-step-badge">${SpConfig.locale.tour.stepBadgeLabel.replace("{current}", String(this.step + 1)).replace("{total}", String(this.steps.length))}</div>

        ${currentStep.title ? html`<p class="sp-tour-title">${currentStep.title}</p>` : nothing}
        <p class="sp-tour-body">${currentStep.content}</p>

        <div class="sp-tour-actions">
          <div class="sp-tour-dots">
            ${this.steps.map((_, i) => html`
              <div class=${`sp-tour-dot${i === this.step ? " sp-tour-dot--active" : ""}`}></div>
            `)}
          </div>
          ${this.step > 0 ? html`
            <button class="sp-tour-btn" @click=${() => this.#prev()}>${SpConfig.locale.tour.prevLabel}</button>
          ` : nothing}
          <button class="sp-tour-btn sp-tour-btn--primary" @click=${() => this.#next()}>
            ${this.step === this.steps.length - 1 ? SpConfig.locale.tour.finishLabel : SpConfig.locale.tour.nextLabel}
          </button>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-tour": SpTourComponent;
  }
}
