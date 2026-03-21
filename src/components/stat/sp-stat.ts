import { LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./sp-stat.css?inline";
import { statTemplate } from "./sp-stat.template.js";
import type { SpStatTrend } from "./sp-stat.types.js";

/**
 * Stat component for displaying a key metric or statistic.
 *
 * @element sp-stat
 *
 * @prop {string}      label       - Descriptive label for the metric
 * @prop {string}      value       - Primary numeric or text value
 * @prop {string}      prefix      - Text shown before the value (e.g. "$")
 * @prop {string}      suffix      - Text shown after the value (e.g. "%")
 * @prop {SpStatTrend} trend       - Trend direction: up | down | neutral
 * @prop {string}      trendValue  - Trend description text (e.g. "+12%")
 * @prop {string}      description - Additional context text below the value
 *
 * @slot - Overrides the value prop with custom content
 */
@customElement("sp-stat")
export class SpStatComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: String })
  label = "";

  @property({ type: String })
  value = "";

  @property({ type: String })
  prefix = "";

  @property({ type: String })
  suffix = "";

  @property({ type: String, reflect: true })
  trend: SpStatTrend = "neutral";

  @property({ type: String })
  trendValue = "";

  @property({ type: String })
  description = "";

  override render() {
    return statTemplate.call(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-stat": SpStatComponent;
  }
}
