import { LitElement, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";
import styles from "./sp-layout.css?inline";

export type SpStackDirection = "column" | "row";
export type SpStackAlign     = "start" | "center" | "end" | "stretch";
export type SpStackJustify   = "start" | "center" | "end" | "between" | "around";
export type SpContainerSize  = "sm" | "md" | "lg" | "xl" | "2xl";

// ─── sp-stack ───────────────────────────────────────────────────────────────

/**
 * Contenedor flexbox para apilar elementos horizontal o verticalmente.
 *
 * @element sp-stack
 * @prop {SpStackDirection} direction - column | row (default column)
 * @prop {string}           gap       - Valor CSS del gap (default "8px")
 * @prop {SpStackAlign}     align     - align-items: start | center | end | stretch
 * @prop {SpStackJustify}   justify   - justify-content: start | center | end | between | around
 * @prop {boolean}          wrap      - flex-wrap: wrap
 * @prop {boolean}          full      - width: 100%
 * @slot - Contenido
 */
@customElement("sp-stack")
export class SpStackComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: String }) direction: SpStackDirection = "column";
  @property({ type: String }) gap = "8px";
  @property({ type: String }) align: SpStackAlign = "stretch";
  @property({ type: String }) justify: SpStackJustify = "start";
  @property({ type: Boolean }) wrap = false;
  @property({ type: Boolean }) full = false;

  override render() {
    return html`
      <div
        class=${classMap({
          "sp-stack": true,
          "sp-stack--row": this.direction === "row",
          "sp-stack--wrap": this.wrap,
          [`sp-stack--align-${this.align}`]: true,
          [`sp-stack--justify-${this.justify}`]: true,
          "sp-stack--full": this.full,
        })}
        style=${styleMap({ gap: this.gap })}
      ><slot></slot></div>
    `;
  }
}

// ─── sp-grid ────────────────────────────────────────────────────────────────

/**
 * Contenedor CSS Grid.
 *
 * @element sp-grid
 * @prop {number|string} cols - Número de columnas o valor CSS de grid-template-columns
 * @prop {string}        gap  - Gap entre celdas (default "16px")
 * @prop {string}        row-gap - Gap entre filas (hereda de gap si no se especifica)
 * @slot - Contenido
 */
@customElement("sp-grid")
export class SpGridComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property() cols: number | string = 12;
  @property({ type: String }) gap = "16px";
  @property({ type: String, attribute: "row-gap" }) rowGap = "";

  override render() {
    const cols = typeof this.cols === "number"
      ? `repeat(${this.cols}, minmax(0, 1fr))`
      : this.cols;

    return html`
      <div
        class="sp-grid"
        style=${styleMap({
          gridTemplateColumns: cols,
          gap: this.gap,
          ...(this.rowGap ? { rowGap: this.rowGap } : {}),
        })}
      ><slot></slot></div>
    `;
  }
}

// ─── sp-container ───────────────────────────────────────────────────────────

/**
 * Contenedor centrado con ancho máximo configurable.
 *
 * @element sp-container
 * @prop {SpContainerSize} size    - sm | md | lg | xl | 2xl (default xl)
 * @prop {boolean}         padded  - Agrega padding horizontal responsive
 * @slot - Contenido
 */
@customElement("sp-container")
export class SpContainerComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: String }) size: SpContainerSize = "xl";
  @property({ type: Boolean }) padded = true;

  override render() {
    return html`
      <div class=${classMap({
        "sp-container": true,
        [`sp-container--${this.size}`]: true,
        "sp-container--padded": this.padded,
      })}><slot></slot></div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-stack": SpStackComponent;
    "sp-grid": SpGridComponent;
    "sp-container": SpContainerComponent;
  }
}
