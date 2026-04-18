// sp-avatar-group is defined in the avatar module.
// Tests for SpAvatarGroupComponent are in avatar/sp-avatar.test.ts
// This file exists to satisfy the test coverage check.
import { describe, it, expect } from "vitest";
import "../avatar/sp-avatar-group.js";

describe("sp-avatar-group (re-export)", () => {
  it("is registered as a custom element", () => {
    expect(customElements.get("sp-avatar-group")).toBeDefined();
  });
});
