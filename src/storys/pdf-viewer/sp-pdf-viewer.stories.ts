import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../../components/pdf-viewer/sp-pdf-viewer.js";

// Publicly accessible PDFs (no CORS restrictions)
const PDF_MOZILLA = "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf";
const PDF_W3C     = "https://www.w3.org/WAI/WCAG21/wcag-2.1.pdf";

const meta: Meta = {
  title: "Components/PdfViewer",
  component: "sp-pdf-viewer",
  tags: ["autodocs"],
  argTypes: {
    src:     { control: "text",    description: "URL of the PDF" },
    height:  { control: "number",  description: "Height in px" },
    toolbar: { control: "boolean", description: "Show toolbar" },
    label:   { control: "text" },
  },
  args: {
    src: PDF_MOZILLA,
    height: 600,
    toolbar: true,
    label: "PDF document",
  },
  render: ({ src, height, toolbar, label }) => html`
    <sp-pdf-viewer
      src=${src || ""}
      height=${height || 600}
      ?toolbar=${toolbar}
      label=${label || "PDF"}
    ></sp-pdf-viewer>
  `,
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const W3cSpec: Story = {
  name: "WCAG 2.1 Spec",
  args: { src: PDF_W3C, label: "WCAG 2.1", height: 700 },
};

export const NoToolbar: Story = {
  args: { toolbar: false },
};

export const Tall: Story = {
  args: { height: 850 },
};

export const NoSource: Story = {
  name: "Empty state",
  args: { src: "" },
};
