import { html, nothing, type TemplateResult } from "lit";
import type { SpTreeComponent } from "./sp-tree.js";

export function treeTemplate(this: SpTreeComponent): TemplateResult {
  return html`
    <div class="sp-tree" role="tree" aria-label=${this.label || nothing}>
      <slot></slot>
    </div>
  `;
}
