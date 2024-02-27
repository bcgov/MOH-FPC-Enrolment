import { afterEach, describe, expect, it, vi } from "vitest";

const spyOnWindowScrollTo = vi
  .spyOn(window, "scrollTo")
  .mockImplementation(vi.fn);

describe("Helper scroll.js scrollTo()", () => {
  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("calls window.scrollTo() when helperscrollTo() is called", () => {
    window.scrollTo(0);
    expect(spyOnWindowScrollTo).toHaveBeenCalled();
  });
});
