import { describe, it, expect } from "bun:test";
import siteConfig from "../.figma/make/site.json";

describe("weights.capital site config", () => {
  it("should have correct title and metadata", () => {
    expect(siteConfig.title).toBe("Weights Capital — AI Startup Accelerator");
    expect(siteConfig.description).toContain("Accelerates AI startups");
    expect(siteConfig.robots).toBeDefined();
  });
});
