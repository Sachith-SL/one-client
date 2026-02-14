import { describe, expect, it, beforeEach } from "vitest";
import { setAccessToken, getAccessToken, clearAccessToken } from "./token";

describe("token utils", () => {
  beforeEach(() => {
    clearAccessToken();
  });

  it("returns null when no token is set", () => {
    expect(getAccessToken()).toBeNull();
  });

  it("stores and retrieves a token", () => {
    setAccessToken("my-test-token");
    expect(getAccessToken()).toBe("my-test-token");
  });

  it("clears the token", () => {
    setAccessToken("my-test-token");
    clearAccessToken();
    expect(getAccessToken()).toBeNull();
  });

  it("overwrites the previous token", () => {
    setAccessToken("token-1");
    setAccessToken("token-2");
    expect(getAccessToken()).toBe("token-2");
  });
});
