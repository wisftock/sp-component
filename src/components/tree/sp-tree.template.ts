import { html, type TemplateResult } from "lit";
import type { SpTreeComponent } from "./sp-tree.js";

export function treeTemplate(this: SpTreeComponent): TemplateResult {
  return html`
    <div class="sp-tree" role="tree">
      <slot></slot>
    </div>
  `;
}
