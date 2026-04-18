import { LitElement, html, unsafeCSS, nothing, svg } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import styles from "./sp-credit-card.css?inline";

type CardNetwork = "visa" | "mastercard" | "amex" | "discover" | "unionpay" | "diners" | "jcb" | "unknown";
type CardTheme = "purple" | "dark" | "blue" | "green" | "gold" | "rose" | "custom";
type CardSize = "sm" | "md" | "lg";

const THEME_GRADIENTS: Record<CardTheme, string> = {
  purple: "linear-gradient(135deg, #6366f1 0%, #818cf8 50%, #a78bfa 100%)",
  dark:   "linear-gradient(135deg, #1e293b 0%, #334155 60%, #475569 100%)",
  blue:   "linear-gradient(135deg, #0ea5e9 0%, #38bdf8 50%, #7dd3fc 100%)",
  green:  "linear-gradient(135deg, #059669 0%, #34d399 60%, #6ee7b7 100%)",
  gold:   "linear-gradient(135deg, #b45309 0%, #d97706 50%, #f59e0b 100%)",
  rose:   "linear-gradient(135deg, #be123c 0%, #e11d48 50%, #fb7185 100%)",
  custom: "",
};

const SIZES: Record<CardSize, { w: number; h: number }> = {
  sm: { w: 300, h: 182 },
  md: { w: 380, h: 230 },
  lg: { w: 460, h: 279 },
};

/** Longitudes válidas por red */
const NETWORK_LENGTHS: Record<CardNetwork, number | number[]> = {
  visa:       [13, 16, 19],
  mastercard: 16,
  amex:       15,
  discover:   16,
  unionpay:   [16, 17, 18, 19],
  diners:     [14, 16],
  jcb:        16,
  unknown:    16,
};

function detectNetwork(num: string): CardNetwork {
  const n = num.replace(/\D/g, "");
  if (/^4/.test(n))                          return "visa";
  if (/^5[1-5]/.test(n) || /^2[2-7]/.test(n)) return "mastercard";
  if (/^3[47]/.test(n))                      return "amex";
  if (/^6(?:011|5)/.test(n))                 return "discover";
  if (/^62/.test(n))                         return "unionpay";
  if (/^3(?:0[0-5]|[68])/.test(n))           return "diners";
  if (/^35(?:2[89]|[3-8]\d)/.test(n))        return "jcb";
  return "unknown";
}

function isValidLength(digits: string, network: CardNetwork): boolean {
  if (digits.length === 0) return true;
  const expected = NETWORK_LENGTHS[network];
  return Array.isArray(expected)
    ? expected.includes(digits.length)
    : digits.length === expected;
}

/** Solo permite funciones CSS gradient para evitar inyección de valores arbitrarios */
function sanitizeGradient(g: string): string {
  const trimmed = g.trim();
  if (/^(linear|radial|conic)-gradient\(/.test(trimmed)) return trimmed;
  return "";
}

function maskNumber(num: string, network: CardNetwork): string {
  const digits = num.replace(/\D/g, "");
  if (network === "amex") {
    return `${digits.slice(0, 4).padEnd(4, "•")} ${digits.slice(4, 10).padEnd(6, "•")} ${digits.slice(10, 15).padEnd(5, "•")}`;
  }
  if (network === "diners") {
    return `${digits.slice(0, 4).padEnd(4, "•")} ${digits.slice(4, 10).padEnd(6, "•")} ${digits.slice(10, 14).padEnd(4, "•")}`;
  }
  return [0, 4, 8, 12].map(i => digits.slice(i, i + 4).padEnd(4, "•")).join(" ");
}

function networkLogo(n: CardNetwork) {
  switch (n) {
    case "visa":
      return svg`<svg viewBox="0 0 60 20" class="sp-cc-net-logo" aria-label="Visa">
        <text x="2" y="16" font-size="18" font-weight="800" font-family="Arial,sans-serif"
          fill="white" letter-spacing="-1">VISA</text>
      </svg>`;
    case "mastercard":
      return html`<div class="sp-cc-mc-logo" aria-label="Mastercard">
        <span class="sp-cc-mc-left"></span>
        <span class="sp-cc-mc-right"></span>
      </div>`;
    case "amex":
      return svg`<svg viewBox="0 0 66 28" class="sp-cc-amex-logo" aria-label="American Express">
        <text x="1" y="12" font-size="11" font-weight="800" font-family="Arial,sans-serif"
          fill="white" letter-spacing="0.4">AMERICAN</text>
        <text x="1" y="26" font-size="11" font-weight="800" font-family="Arial,sans-serif"
          fill="white" letter-spacing="0.4">EXPRESS</text>
      </svg>`;
    case "discover":
      return svg`<svg viewBox="0 0 70 20" class="sp-cc-net-logo" aria-label="Discover">
        <text x="1" y="16" font-size="13" font-weight="700" font-family="Arial,sans-serif"
          fill="white" letter-spacing="0.3">DISCOVER</text>
      </svg>`;
    case "unionpay":
      return svg`<svg viewBox="0 0 72 20" class="sp-cc-net-logo" aria-label="UnionPay">
        <text x="1" y="15" font-size="12" font-weight="700" font-family="Arial,sans-serif"
          fill="white" letter-spacing="0.3">UnionPay</text>
      </svg>`;
    case "diners":
      return svg`<svg viewBox="0 0 62 20" class="sp-cc-net-logo" aria-label="Diners Club">
        <text x="1" y="15" font-size="11" font-weight="700" font-family="Arial,sans-serif"
          fill="white" letter-spacing="0.5">DINERS</text>
      </svg>`;
    case "jcb":
      return svg`<svg viewBox="0 0 50 20" class="sp-cc-net-logo" aria-label="JCB">
        <text x="2" y="16" font-size="16" font-weight="800" font-family="Arial,sans-serif"
          fill="white" letter-spacing="1">JCB</text>
      </svg>`;
    default:
      return nothing;
  }
}

/**
 * Credit Card — tarjeta de crédito visual con flip animation y detección de red.
 *
 * @element sp-credit-card
 *
 * @prop {string}    number      - Número de tarjeta (detecta VISA/MC/AMEX/Discover/UnionPay/Diners/JCB)
 * @prop {string}    holder      - Nombre del titular
 * @prop {string}    expiry      - Fecha de vencimiento "MM/YY"
 * @prop {string}    cvv         - Código CVV
 * @prop {boolean}   flipped     - Muestra el reverso
 * @prop {boolean}   interactive - Permite flip al hacer click o teclado (Space/Enter)
 * @prop {boolean}   masked      - Oculta el CVV con ••• aunque esté definido
 * @prop {CardTheme} theme       - Tema: purple | dark | blue | green | gold | rose | custom
 * @prop {string}    gradient    - CSS gradient personalizado (requiere theme="custom")
 * @prop {CardSize}  size        - Tamaño: sm | md | lg
 * @prop {string}    label       - aria-label del componente
 *
 * @fires sp-flip - Se emite cuando la tarjeta cambia de cara. detail: { flipped: boolean }
 *
 * @cssprop --sp-cc-width  - Ancho de la tarjeta (default según size prop)
 * @cssprop --sp-cc-height - Alto de la tarjeta (default según size prop)
 * @cssprop --sp-cc-radius - Radio del borde (default 18px)
 */
@customElement("sp-credit-card")
export class SpCreditCardComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: String }) number = "";
  @property({ type: String }) holder = "NOMBRE APELLIDO";
  @property({ type: String }) expiry = "MM/YY";
  @property({ type: String }) cvv = "";
  @property({ type: Boolean }) flipped = false;
  @property({ type: Boolean }) interactive = false;
  @property({ type: Boolean }) masked = false;
  @property({ type: String }) theme: CardTheme = "purple";
  @property({ type: String }) gradient = "";
  @property({ type: String }) size: CardSize = "md";
  @property({ type: String }) label = "Credit card";

  private _initialized = false;

  override updated(changed: Map<string, unknown>) {
    if (!this._initialized) {
      this._initialized = true;
      return;
    }
    if (changed.has("flipped")) {
      this.dispatchEvent(new CustomEvent("sp-flip", {
        detail: { flipped: this.flipped },
        bubbles: true,
        composed: true,
      }));
    }
  }

  private _handleClick() {
    if (!this.interactive) return;
    this.flipped = !this.flipped;
  }

  private _handleKeyDown(e: KeyboardEvent) {
    if (!this.interactive) return;
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      this.flipped = !this.flipped;
    }
  }

  override render() {
    const network = detectNetwork(this.number);
    const digits  = this.number.replace(/\D/g, "");
    const maskedNum   = maskNumber(this.number, network);
    const validLength = isValidLength(digits, network);
    const bg  = this.theme === "custom" ? sanitizeGradient(this.gradient) : THEME_GRADIENTS[this.theme];
    const sz  = SIZES[this.size] ?? SIZES.md;
    const cvvDisplay = this.masked ? "•••" : (this.cvv || "•••");

    return html`
      <div
        class=${classMap({ "sp-cc-scene": true, "sp-cc-scene--interactive": this.interactive })}
        style="width:${sz.w}px;height:${sz.h}px"
        role=${this.interactive ? "button" : "group"}
        aria-label=${this.label}
        aria-pressed=${this.interactive ? String(this.flipped) : nothing}
        tabindex=${this.interactive ? "0" : nothing}
        @click=${this._handleClick}
        @keydown=${this._handleKeyDown}
      >
        <!-- Anuncio para lectores de pantalla -->
        <span class="sp-cc-announce" aria-live="polite" aria-atomic="true">
          ${this.flipped ? "Mostrando reverso de la tarjeta" : "Mostrando frente de la tarjeta"}
        </span>

        <div class=${classMap({ "sp-cc-card": true, "flipped": this.flipped })}>

          <!-- Front -->
          <div class="sp-cc-face sp-cc-front" style=${bg ? `background:${bg}` : ""}>
            <div class="sp-cc-header">
              <!-- EMV Chip -->
              <div class="sp-cc-chip">
                <div class="sp-cc-chip-line sp-cc-chip-line--h"></div>
                <div class="sp-cc-chip-line sp-cc-chip-line--v"></div>
                <div class="sp-cc-chip-box sp-cc-chip-box--tl"></div>
                <div class="sp-cc-chip-box sp-cc-chip-box--tr"></div>
                <div class="sp-cc-chip-box sp-cc-chip-box--bl"></div>
                <div class="sp-cc-chip-box sp-cc-chip-box--br"></div>
              </div>
              <!-- NFC icon -->
              <svg class="sp-cc-nfc" viewBox="0 0 24 24" fill="none" aria-label="Contactless payment">
                <path d="M12 20c-4.4 0-8-3.6-8-8s3.6-8 8-8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.4"/>
                <path d="M12 16c-2.2 0-4-1.8-4-4s1.8-4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.65"/>
                <path d="M12 12.5a.5.5 0 110 1 .5.5 0 010-1z" fill="currentColor"/>
                <path d="M12 12c0 2.2 1.8 4 4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.9"/>
                <path d="M12 8c0 4.4 3.6 8 8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </div>

            <div class=${classMap({ "sp-cc-number": true, "sp-cc-number--invalid": !validLength })}>
              ${maskedNum}
            </div>

            <div class="sp-cc-bottom">
              <div>
                <div class="sp-cc-label">Titular</div>
                <div class="sp-cc-value">${this.holder || "— — —"}</div>
              </div>
              <div class="sp-cc-expiry-col">
                <div class="sp-cc-label">Vence</div>
                <div class="sp-cc-value">${this.expiry}</div>
              </div>
              <div class="sp-cc-network-logo">
                ${networkLogo(network)}
              </div>
            </div>
          </div>

          <!-- Back -->
          <div class="sp-cc-face sp-cc-back">

            <!-- 1. Banda magnética -->
            <div class="sp-cc-mag-stripe" aria-hidden="true"></div>

            <!-- 2. Franja de firma + CVV -->
            <div class="sp-cc-sig-row">
              <div class="sp-cc-sig-strip" aria-hidden="true"></div>
              <div class="sp-cc-cvv-panel">
                <span class="sp-cc-cvv-label">CVV</span>
                <div class="sp-cc-cvv-value" aria-label="CVV">${cvvDisplay}</div>
              </div>
            </div>

            <!-- 3. Pie: texto legal + logo de red -->
            <div class="sp-cc-back-footer">
              <p class="sp-cc-back-disclaimer">
                This card is the property of the issuing bank and must be returned upon request.
                Use subject to cardholder agreement terms and conditions.
              </p>
              <div class="sp-cc-back-net" aria-hidden="true">
                ${networkLogo(network)}
              </div>
            </div>

          </div>

        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { "sp-credit-card": SpCreditCardComponent; }
}
