import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import type { SpFileUploadProps } from "../../components/file-upload/sp-file-upload.types.js";
import "../../components/file-upload/sp-file-upload.js";

const meta: Meta<SpFileUploadProps> = {
  title: "Components/FileUpload",
  component: "sp-file-upload",
  tags: ["autodocs"],
  argTypes: {
    accept: { control: "text", description: "Accepted file types (e.g. image/*,.pdf)" },
    multiple: { control: "boolean", description: "Allow multiple file selection" },
    disabled: { control: "boolean", description: "Disables the upload area" },
    maxSize: { control: "number", description: "Max file size in bytes (0 = no limit)" },
    label: { control: "text", description: "Dropzone label text" },
    hint: { control: "text", description: "Hint text inside dropzone" },
    error: { control: "text", description: "External error message" },
    variant: {
      control: "select",
      options: ["default", "compact"],
      description: "Visual variant",
    },
  },
  args: {
    accept: "",
    multiple: false,
    disabled: false,
    maxSize: 0,
    label: "Drop files here or click to upload",
    hint: "",
    error: "",
    variant: "default",
  },
  render: ({ accept, multiple, disabled, maxSize, label, hint, error, variant }) => html`
    <sp-file-upload
      accept=${accept}
      ?multiple=${multiple}
      ?disabled=${disabled}
      max-size=${maxSize}
      label=${label}
      hint=${hint}
      error=${error}
      variant=${variant}
      style="max-width: 480px;"
    ></sp-file-upload>
  `,
};

export default meta;
type Story = StoryObj<SpFileUploadProps>;

export const Default: Story = {
  args: {},
};

export const WithHint: Story = {
  args: { hint: "PNG, JPG, PDF up to 10MB" },
};

export const Multiple: Story = {
  args: { multiple: true, hint: "Select multiple files" },
};

export const AcceptImages: Story = {
  args: { accept: "image/*", hint: "Only image files are accepted" },
};

export const WithMaxSize: Story = {
  args: { maxSize: 1024 * 1024, hint: "Maximum file size: 1 MB" },
};

export const Disabled: Story = {
  args: { disabled: true, label: "Upload disabled" },
};
