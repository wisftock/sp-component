import { LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./sp-timeline.css?inline";
import { timelineTemplate } from "./sp-timeline.template.js";
import type { SpTimelineItem } from "./sp-timeline.types.js";

/**
 * Timeline component for displaying a sequence of events.
 *
 * @element sp-timeline
 *
 * @prop {SpTimelineItem[]} items   - Array of timeline items to display
 * @prop {boolean}          reverse - Reverses the display order of items
 */
@customElement("sp-timeline")
export class SpTimelineComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: Array })
  items: SpTimelineItem[] = [];

  @property({ type: Boolean, reflect: true })
  reverse = false;

  override render() {
    return timelineTemplate.call(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-timeline": SpTimelineComponent;
  }
}
