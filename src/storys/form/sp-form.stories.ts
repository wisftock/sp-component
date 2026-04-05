import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../../components/form/sp-form.js";
import "../../components/input/sp-input.js";
import "../../components/textarea/sp-textarea.js";
import "../../components/select/sp-select.js";
import "../../components/checkbox/sp-checkbox.js";
import "../../components/switch/sp-switch.js";
import "../../components/button/sp-button.js";

const meta: Meta = {
  title: "Forms/Form",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
**sp-form** wraps native \`<form>\` to integrate with all form-associated \`sp-*\` components.

- Native \`FormData\` serialization on submit
- \`reportValidity()\` triggers browser + component-level validation UI (\`:user-invalid\` CSS)
- \`setCustomValidity()\` on any sp-* control for server-driven errors
- \`reset()\` / \`submit()\` programmatic API

\`\`\`html
<sp-form @sp-submit=${"{(e) => console.log([...e.detail.formData])}"}>
  <sp-input name="email" type="email" required label="Email"></sp-input>
  <sp-button type="submit">Send</sp-button>
</sp-form>
\`\`\`
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const BasicForm: Story = {
  name: "Basic form with validation",
  render: () => {
    const onSubmit = (e: Event) => {
      const out = document.getElementById("form-output");
      if (!out) return;
      const entries = [...(e as CustomEvent).detail.formData.entries()];
      out.textContent = "Submitted: " + JSON.stringify(Object.fromEntries(entries), null, 2);
    };
    return html`
      <sp-form @sp-submit=${onSubmit} style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
        <sp-input name="name" label="Full name" required placeholder="John Doe"></sp-input>
        <sp-input name="email" type="email" label="Email" required placeholder="john@example.com"></sp-input>
        <sp-textarea name="bio" label="Bio" placeholder="Tell us about yourself…"></sp-textarea>
        <sp-select
          name="role"
          label="Role"
          required
          placeholder="Select a role"
          .options=${[
            { value: "dev", label: "Developer" },
            { value: "design", label: "Designer" },
            { value: "pm", label: "Product Manager" },
          ]}
        ></sp-select>
        <sp-checkbox name="terms" required label="I agree to the terms and conditions"></sp-checkbox>
        <sp-button type="submit">Submit</sp-button>
        <pre id="form-output" style="font-size: 12px; color: #374151; background: #f9fafb; padding: 12px; border-radius: 6px; min-height: 40px;"></pre>
      </sp-form>
    `;
  },
};

export const CustomValidity: Story = {
  name: "Server-side error (setCustomValidity)",
  render: () => {
    const onSubmit = (e: Event) => {
      e.preventDefault?.();
      const emailEl = document.querySelector<any>("#cv-email");
      if (emailEl) {
        emailEl.setCustomValidity("This email is already registered.");
        emailEl.reportValidity();
      }
    };
    const onInput = () => {
      const emailEl = document.querySelector<any>("#cv-email");
      if (emailEl) emailEl.setCustomValidity("");
    };
    return html`
      <div style="max-width: 400px; display: flex; flex-direction: column; gap: 16px;">
        <p style="font-size: 13px; color: #6b7280; margin: 0;">
          Submit to simulate a server error on the email field.
        </p>
        <sp-form @sp-submit=${onSubmit} style="display: flex; flex-direction: column; gap: 16px;">
          <sp-input
            id="cv-email"
            name="email"
            type="email"
            label="Email"
            required
            placeholder="existing@example.com"
            @sp-input=${onInput}
          ></sp-input>
          <sp-button type="submit">Register</sp-button>
        </sp-form>
      </div>
    `;
  },
};

export const UserInvalidCSS: Story = {
  name: ":user-invalid CSS states",
  render: () => html`
    <div style="max-width: 400px; display: flex; flex-direction: column; gap: 16px;">
      <p style="font-size: 13px; color: #6b7280; margin: 0;">
        Focus and blur each field without filling it in to see the <code>:user-invalid</code> red border.
        Fill it in correctly to see the <code>:user-valid</code> green border.
      </p>
      <sp-form style="display: flex; flex-direction: column; gap: 16px;">
        <sp-input name="name" label="Name (required)" required placeholder="Your name"></sp-input>
        <sp-input name="email" type="email" label="Email (required)" required placeholder="you@example.com"></sp-input>
        <sp-textarea name="message" label="Message (required)" required placeholder="Write something…"></sp-textarea>
        <sp-checkbox name="agree" required label="I agree to the terms"></sp-checkbox>
        <sp-switch name="newsletter" required label="Subscribe to newsletter (required)"></sp-switch>
      </sp-form>
    </div>
  `,
};
