import { LitElement, html, unsafeCSS, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import styles from "./sp-dnd-zone.css?inline";

export interface DndItem {
  id: string;
  label: string;
  data?: unknown;
}

// Global drag state shared across all sp-dnd-zone instances
const G: {
  item: DndItem | null;
  sourceZone: SpDndZoneComponent | null;
  ghost: HTMLElement | null;
} = { item: null, sourceZone: null, ghost: null };

/**
 * DnD Zone — zona de drag & drop con grupos y transferencia entre zonas.
 *
 * @element sp-dnd-zone
 *
 * @prop {DndItem[]} items    - Items en la zona
 * @prop {string}    group    - Nombre del grupo (solo se acepta entre mismos grupos)
 * @prop {string}    placeholder - Texto cuando está vacío
 *
 * @fires sp-drop    - { item: DndItem, fromZone: string, toZone: string, newItems: DndItem[] }
 * @fires sp-reorder - { items: DndItem[] }
 */
@customElement("sp-dnd-zone")
export class SpDndZoneComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: Array }) items: DndItem[] = [];
  @property({ type: String }) group = "default";
  @property({ type: String }) placeholder = "Arrastra items aquí";
  @property({ type: String, attribute: "zone-id" }) zoneId = "";

  @state() private _over = false;
  @state() private _draggingId: string | null = null;
  @state() private _overItemId: string | null = null;

  #startDrag(e: PointerEvent, item: DndItem) {
    e.preventDefault();
    G.item = item;
    G.sourceZone = this;
    this._draggingId = item.id;

    // Create ghost
    const ghost = document.createElement("div");
    ghost.className = "sp-dnd-ghost";
    ghost.style.cssText = `
      position:fixed; pointer-events:none; z-index:10000; opacity:0.9;
      background: var(--sp-bg,#fff); border: 1px solid var(--sp-primary,#6366f1);
      border-radius: 6px; padding: 10px 12px; font-size: 13px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.2); transform: rotate(2deg);
      font-family: inherit; max-width: 200px; white-space: nowrap;
      color: var(--sp-text,#111827);
    `;
    ghost.textContent = item.label;
    document.body.appendChild(ghost);
    G.ghost = ghost;

    const move = (e2: PointerEvent) => {
      if (G.ghost) {
        G.ghost.style.left = `${e2.clientX + 12}px`;
        G.ghost.style.top = `${e2.clientY - 20}px`;
      }
    };

    const up = () => {
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerup", up);
      if (G.ghost) { G.ghost.remove(); G.ghost = null; }
      this._draggingId = null;
      this._overItemId = null;
      G.item = null;
      G.sourceZone = null;
      // Notify all zones to clear over state
      document.querySelectorAll("sp-dnd-zone").forEach(z => {
        (z as SpDndZoneComponent)._over = false;
        (z as SpDndZoneComponent)._overItemId = null;
      });
    };

    document.addEventListener("pointermove", move);
    document.addEventListener("pointerup", up);

    // Initial position
    if (G.ghost) {
      G.ghost.style.left = `${e.clientX + 12}px`;
      G.ghost.style.top = `${e.clientY - 20}px`;
    }
  }

  #onPointerEnter() {
    if (!G.item) return;
    if (G.sourceZone?.group !== this.group && this.group !== "any") return;
    this._over = true;
  }

  #onPointerLeave() {
    this._over = false;
    this._overItemId = null;
  }

  #onItemEnter(id: string) {
    if (!G.item) return;
    this._overItemId = id;
  }

  #onDrop() {
    if (!G.item) return;
    if (G.sourceZone?.group !== this.group && this.group !== "any") {
      this._over = false;
      return;
    }

    const droppedItem = G.item;
    const fromZone = G.sourceZone;
    this._over = false;

    let newItems = [...this.items];

    // Remove from source if different zone
    if (fromZone && fromZone !== this) {
      const fromItems = fromZone.items.filter(i => i.id !== droppedItem.id);
      fromZone.items = fromItems;
      fromZone.requestUpdate();
      fromZone.dispatchEvent(new CustomEvent("sp-reorder", {
        detail: { items: fromItems }, bubbles: true, composed: true,
      }));
    } else {
      // Remove from current position in same zone
      newItems = newItems.filter(i => i.id !== droppedItem.id);
    }

    // Insert at hover position or end
    const overIdx = this._overItemId ? newItems.findIndex(i => i.id === this._overItemId) : -1;
    if (overIdx >= 0) {
      newItems.splice(overIdx, 0, droppedItem);
    } else {
      newItems.push(droppedItem);
    }

    this.items = newItems;
    this._overItemId = null;

    this.dispatchEvent(new CustomEvent("sp-drop", {
      detail: {
        item: droppedItem,
        fromZone: fromZone?.zoneId || fromZone?.group,
        toZone: this.zoneId || this.group,
        newItems,
      },
      bubbles: true, composed: true,
    }));

    this.dispatchEvent(new CustomEvent("sp-reorder", {
      detail: { items: newItems }, bubbles: true, composed: true,
    }));
  }

  override render() {
    return html`
      <div
        class=${classMap({ "sp-dnd-zone": true, "over": this._over })}
        @pointerenter=${() => this.#onPointerEnter()}
        @pointerleave=${() => this.#onPointerLeave()}
        @pointerup=${() => this.#onDrop()}
      >
        ${this.items.length === 0 ? html`
          <div class="sp-dnd-zone-label">${this.placeholder}</div>
        ` : nothing}

        ${this.items.map(item => html`
          <div
            class=${classMap({
              "sp-dnd-item": true,
              "dragging": this._draggingId === item.id,
              "drag-over": this._overItemId === item.id,
            })}
            @pointerenter=${() => this.#onItemEnter(item.id)}
            @pointerdown=${(e: PointerEvent) => this.#startDrag(e, item)}
          >
            <span class="sp-dnd-handle">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="9" cy="5" r="1" fill="currentColor"/><circle cx="15" cy="5" r="1" fill="currentColor"/>
                <circle cx="9" cy="12" r="1" fill="currentColor"/><circle cx="15" cy="12" r="1" fill="currentColor"/>
                <circle cx="9" cy="19" r="1" fill="currentColor"/><circle cx="15" cy="19" r="1" fill="currentColor"/>
              </svg>
            </span>
            <span style="flex:1">${item.label}</span>
          </div>
        `)}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { "sp-dnd-zone": SpDndZoneComponent; }
}
