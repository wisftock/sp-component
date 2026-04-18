import { LitElement, html, unsafeCSS, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import styles from "./sp-org-chart.css?inline";

export interface OrgNode {
  id: string;
  name: string;
  role?: string;
  avatar?: string; // URL or initials
  color?: string;
  children?: OrgNode[];
}

function initials(name: string): string {
  return name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
}

/**
 * Org Chart — árbol organizacional con nodos colapsables y conexiones SVG.
 *
 * @element sp-org-chart
 *
 * @prop {OrgNode}  data        - Nodo raíz del árbol
 * @prop {string}   selected-id - ID del nodo seleccionado
 *
 * @fires sp-select - { id: string, node: OrgNode }
 */
@customElement("sp-org-chart")
export class SpOrgChartComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: Object }) data: OrgNode | null = null;
  @property({ type: String, attribute: "selected-id" }) selectedId = "";

  @state() private _collapsed = new Set<string>();

  #toggle(id: string) {
    const next = new Set(this._collapsed);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    this._collapsed = next;
  }

  #select(node: OrgNode) {
    this.selectedId = node.id;
    this.dispatchEvent(new CustomEvent("sp-select", {
      detail: { id: node.id, node },
      bubbles: true, composed: true,
    }));
  }

  #renderNode(node: OrgNode): unknown {
    const collapsed = this._collapsed.has(node.id);
    const hasChildren = node.children && node.children.length > 0;

    return html`
      <div class="sp-org-branch">
        <div class="sp-org-node">
          <div
            class="sp-org-card ${this.selectedId === node.id ? "selected" : ""}"
            @click=${() => this.#select(node)}
            title=${node.name}
          >
            <div class="sp-org-avatar-wrap">
              ${node.avatar?.startsWith("http") ? html`
                <img class="sp-org-avatar" src=${node.avatar} alt=${node.name}/>
              ` : html`
                <div class="sp-org-avatar" style=${node.color ? `background:${node.color}` : ""}>
                  ${node.avatar || initials(node.name)}
                </div>
              `}
            </div>
            <div class="sp-org-info">
              <span class="sp-org-name">${node.name}</span>
              ${node.role ? html`<span class="sp-org-role">${node.role}</span>` : nothing}
            </div>
            ${hasChildren ? html`
              <button
                class="sp-org-collapse-btn"
                @click=${(e: Event) => { e.stopPropagation(); this.#toggle(node.id); }}
                title=${collapsed ? "Expandir" : "Colapsar"}
              >${collapsed ? "+" : "−"}</button>
            ` : nothing}
          </div>
        </div>

        ${hasChildren && !collapsed ? html`
          <div class="sp-org-children-wrap">
            <div class="sp-org-vert-line"></div>
            <div class="sp-org-children-row">
              ${this.#renderChildren(node.children!)}
            </div>
          </div>
        ` : nothing}
      </div>
    `;
  }

  #renderChildren(children: OrgNode[]) {
    if (children.length === 1) {
      return this.#renderNode(children[0]!);
    }

    return html`
      <div style="display:flex;flex-direction:column;align-items:center">
        <!-- Horizontal line spanning all children -->
        <div style="display:flex;align-items:flex-start;gap:16px;position:relative">
          <!-- Top horizontal connector -->
          <div style="
            position:absolute;
            top:0;
            left:calc(50% - 0.5px);
            border-left: 1px solid var(--sp-border,#d1d5db);
            height:0;
          "></div>
          ${this.#renderChildrenRow(children)}
        </div>
      </div>
    `;
  }

  #renderChildrenRow(children: OrgNode[]) {
    // Each child gets a vertical connector from the top
    return html`
      <div style="display:flex;gap:16px;position:relative">
        <!-- Horizontal line above all children -->
        <div style="
          position:absolute;
          top:0;
          left:50%;
          transform:translateX(-50%);
          width:calc(100% - 80px);
          height:1px;
          background:var(--sp-border,#d1d5db);
          min-width:0;
        "></div>
        ${children.map(child => html`
          <div style="display:flex;flex-direction:column;align-items:center">
            <div style="width:1px;height:20px;background:var(--sp-border,#d1d5db)"></div>
            ${this.#renderNode(child)}
          </div>
        `)}
      </div>
    `;
  }

  override render() {
    if (!this.data) return html`<div style="padding:16px;color:var(--sp-text-muted,#9ca3af)">Sin datos</div>`;

    return html`
      <div class="sp-org">
        <div class="sp-org-tree">
          ${this.#renderNode(this.data)}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { "sp-org-chart": SpOrgChartComponent; }
}
