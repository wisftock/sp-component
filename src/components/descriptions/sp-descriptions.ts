import { LitElement, html, unsafeCSS, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./sp-descriptions.css?inline";

export interface SpDescriptionsItem {
  label: string;
  value: unknown;
  span?: number;  // Cuántas columnas ocupa este ítem
}

export type SpDescriptionsVariant = "default" | "bordered";
export type SpDescriptionsSize    = "sm" | "md" | "lg";

/**
 * Descriptions — tabla clave-valor para mostrar detalles de un registro.
 *
 * @element sp-descriptions
 *
 * @prop {SpDescriptionsItem[]} items   - Pares clave-valor
 * @prop {string}               title   - Título opcional encima de la tabla
 * @prop {number}               columns - Número de columnas (default 2)
 * @prop {SpDescriptionsVariant} variant - default | bordered
 * @prop {SpDescriptionsSize}   size    - sm | md | lg
 * @prop {boolean}              colon   - Agrega ":" al final del label (default true)
 */
@customElement("sp-descriptions")
export class SpDescriptionsComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: Array }) items: SpDescriptionsItem[] = [];
  @property({ type: String }) title = "";
  @property({ type: Number }) columns = 2;
  @property({ type: String, reflect: true }) variant: SpDescriptionsVariant = "default";
  @property({ type: String, reflect: true }) size: SpDescriptionsSize = "md";
  @property({ type: Boolean }) colon = true;

  #buildRows(): SpDescriptionsItem[][] {
    const rows: SpDescriptionsItem[][] = [];
    let current: SpDescriptionsItem[] = [];
    let remaining = this.columns;

    for (const item of this.items) {
      const span = Math.min(item.span ?? 1, this.columns);
      if (span > remaining) {
        rows.push(current);
        current = [];
        remaining = this.columns;
      }
      current.push(item);
      remaining -= span;
      if (remaining === 0) {
        rows.push(current);
        current = [];
        remaining = this.columns;
      }
    }
    if (current.length) rows.push(current);
    return rows;
  }

  override render() {
    const rows = this.#buildRows();

    return html`
      ${this.title ? html`<div class="sp-desc-title">${this.title}</div>` : nothing}
      <table class="sp-desc">
        <tbody>
          ${rows.map(row => html`
            <tr>
              ${row.map(item => {
                const span = item.span ?? 1;
                return html`
                  <th class="sp-desc-label" scope="row">${item.label}${this.colon ? ":" : ""}</th>
                  <td class="sp-desc-value" colspan=${span > 1 ? String((span * 2) - 1) : "1"}>
                    ${item.value}
                  </td>
                `;
              })}
            </tr>
          `)}
        </tbody>
      </table>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { "sp-descriptions": SpDescriptionsComponent; }
}
