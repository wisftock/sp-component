export type SpStepStatus = "complete" | "current" | "upcoming" | "error";

export type SpStepperOrientation = "horizontal" | "vertical";

export interface SpStepperStep {
  label: string;
  description?: string;
  status?: SpStepStatus;
  optional?: boolean;
}

export interface SpStepperProps {
  steps: SpStepperStep[];
  activeStep: number;
  orientation: SpStepperOrientation;
  linear: boolean;
  editable: boolean;
  showProgress: boolean;
}
