import { LitElement, html, unsafeCSS, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import styles from "./sp-onboarding.css?inline";
import { SpConfig } from "../../config.js";

export interface SpOnboardingStep {
  title: string;
  description: string;
  image?: string;      // URL for optional illustration
  icon?: string;       // Emoji or text icon
}

/**
 * Onboarding modal with multi-step flow, progress dots and animations.
 *
 * @element sp-onboarding
 *
 * @prop {SpOnboardingStep[]} steps      - Onboarding steps
 * @prop {boolean}            open       - Controls visibility
 * @prop {number}             step       - Current step (0-based)
 * @prop {string}             finishLabel - Label for the finish button (default "Get started")
 * @prop {boolean}            dismissable - Show skip / close button (default true)
 *
 * @fires {CustomEvent<{ step: number }>} sp-step  - Step changed
 * @fires {CustomEvent}                   sp-finish - User finished onboarding
 * @fires {CustomEvent}                   sp-skip   - User skipped
 */
@customElement("sp-onboarding")
export class SpOnboardingComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: Array }) steps: SpOnboardingStep[] = [];
  @property({ type: Boolean, reflect: true }) open = false;
  @property({ type: Number }) step = 0;
  @property({ type: String, attribute: "finish-label" }) finishLabel = "Get started";
  @property({ type: Boolean }) dismissable = true;

  @state() private _dir: "forward" | "backward" = "forward";

  #next() {
    if (this.step < this.steps.length - 1) {
      this._dir = "forward";
      this.step++;
      this.dispatchEvent(new CustomEvent("sp-step", { detail: { step: this.step }, bubbles: true, composed: true }));
    } else {
      this.#finish();
    }
  }

  #prev() {
    if (this.step > 0) {
      this._dir = "backward";
      this.step--;
      this.dispatchEvent(new CustomEvent("sp-step", { detail: { step: this.step }, bubbles: true, composed: true }));
    }
  }

  #finish() {
    this.open = false;
    this.step = 0;
    this.dispatchEvent(new CustomEvent("sp-finish", { bubbles: true, composed: true }));
  }

  #skip() {
    this.open = false;
    this.step = 0;
    this.dispatchEvent(new CustomEvent("sp-skip", { bubbles: true, composed: true }));
  }

  override render() {
    if (!this.open || this.steps.length === 0) return nothing;
    const current = this.steps[this.step];
    if (!current) return nothing;
    const isLast = this.step === this.steps.length - 1;

    return html`
      <div class="sp-ob-backdrop" @click=${() => { if (this.dismissable) this.#skip(); }}>
        <div class="sp-ob-modal" role="dialog" aria-modal="true" @click=${(e: Event) => e.stopPropagation()}>

          <!-- Skip button -->
          ${this.dismissable ? html`
            <button class="sp-ob-skip" aria-label=${SpConfig.locale.onboarding.skipLabel} @click=${() => this.#skip()}>
              ${SpConfig.locale.onboarding.skipLabel}
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M3 3l10 10M13 3L3 13"/>
              </svg>
            </button>
          ` : nothing}

          <!-- Step content -->
          <div class="sp-ob-content" style=${styleMap({ "--dir": this._dir === "forward" ? "1" : "-1" })}>
            ${current.image ? html`
              <div class="sp-ob-image-wrap">
                <img class="sp-ob-image" src=${current.image} alt="" />
              </div>
            ` : current.icon ? html`
              <div class="sp-ob-icon">${current.icon}</div>
            ` : nothing}

            <h2 class="sp-ob-title">${current.title}</h2>
            <p class="sp-ob-desc">${current.description}</p>
          </div>

          <!-- Progress dots -->
          <div class="sp-ob-dots" role="tablist" aria-label="Progress">
            ${this.steps.map((_, i) => html`
              <button
                class="sp-ob-dot${i === this.step ? " sp-ob-dot--active" : ""}"
                role="tab"
                aria-selected=${i === this.step}
                aria-label="Step ${i + 1}"
                @click=${() => { this._dir = i > this.step ? "forward" : "backward"; this.step = i; }}
              ></button>
            `)}
          </div>

          <!-- Actions -->
          <div class="sp-ob-actions">
            ${this.step > 0 ? html`
              <button class="sp-ob-btn sp-ob-btn--ghost" @click=${() => this.#prev()}>${SpConfig.locale.onboarding.prevLabel}</button>
            ` : html`<span></span>`}
            <button class="sp-ob-btn sp-ob-btn--primary" @click=${() => this.#next()}>
              ${isLast ? this.finishLabel : SpConfig.locale.onboarding.nextLabel}
            </button>
          </div>

        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { "sp-onboarding": SpOnboardingComponent; }
}
