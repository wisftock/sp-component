import { LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./sp-stepper.css?inline";
import { stepperTemplate } from "./sp-stepper.template.js";
import type { SpStepperStep, SpStepStatus, SpStepperOrientation } from "./sp-stepper.types.js";

/**
 * Multi-step progress indicator component.
 *
 * @element sp-stepper
 *
 * @prop {SpStepperStep[]}      steps       - Array of step definitions
 * @prop {number}               activeStep  - Index of the currently active step (0-based)
 * @prop {SpStepperOrientation} orientation - Layout direction: horizontal | vertical
 * @prop {boolean}              linear      - When true, prevents navigating ahead of active step
 *
 * @fires {CustomEvent<{ step: number }>} sp-step-change - Emitted when a step is clicked
 */
@customElement("sp-stepper")
export class SpStepperComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: Array })
  steps: SpStepperStep[] = [];

  @property({ type: Number })
  activeStep = 0;

  @property({ type: String, reflect: true })
  orientation: SpStepperOrientation = "horizontal";

  @property({ type: Boolean })
  linear = true;

  /** Allow clicking completed steps to go back */
  @property({ type: Boolean })
  editable = false;

  /** Show "Step N of M" progress text */
  @property({ type: Boolean, attribute: "show-progress" })
  showProgress = false;

  override render() {
    return stepperTemplate.call(this);
  }

  _getStepStatus(index: number): SpStepStatus {
    const explicitStatus = this.steps[index]?.status;
    if (explicitStatus) return explicitStatus;
    if (index < this.activeStep) return "complete";
    if (index === this.activeStep) return "current";
    return "upcoming";
  }

  _isStepClickable(index: number): boolean {
    if (index === this.activeStep) return false;
    // Going back is always allowed (editable means completed steps are re-editable)
    if (index < this.activeStep) return true;
    // Going forward only allowed in non-linear mode
    return !this.linear;
  }

  readonly _handleStepClick = (index: number): void => {
    if (this.linear && index > this.activeStep) return;
    this.activeStep = index;
    this.dispatchEvent(
      new CustomEvent("sp-step-change", {
        detail: { step: index },
        bubbles: true,
        composed: true,
      }),
    );
  };
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-stepper": SpStepperComponent;
  }
}
