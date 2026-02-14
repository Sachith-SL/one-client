import { describe, expect, it, vi, beforeEach } from "vitest";
import { getUserRoles, getUsername, isTokenExpired } from "./jwt";

// Mock the token module
vi.mock("./token", () => ({
  getAccessToken: vi.fn(),
}));

import { getAccessToken } from "./token";

const mockedGetAccessToken = vi.mocked(getAccessToken);

// Helper to create a JWT token (header.payload.signature)
const createToken = (payload: object): string => {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = btoa(JSON.stringify(payload));
  const signature = "test-signature";
  return `${header}.${body}.${signature}`;
};

describe("jwt utils", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getUserRoles", () => {
    it("returns empty array when no token exists", () => {
      mockedGetAccessToken.mockReturnValue(null);
      expect(getUserRoles()).toEqual([]);
    });

    it("returns roles from a valid token", () => {
      const token = createToken({
        sub: "admin",
        roles: ["ROLE_ADMIN", "ROLE_USER"],
        exp: Math.floor(Date.now() / 1000) + 3600,
      });
      mockedGetAccessToken.mockReturnValue(token);
      expect(getUserRoles()).toEqual(["ROLE_ADMIN", "ROLE_USER"]);
    });

    it("returns empty array when token has no roles", () => {
      const token = createToken({
        sub: "user",
        exp: Math.floor(Date.now() / 1000) + 3600,
      });
      mockedGetAccessToken.mockReturnValue(token);
      expect(getUserRoles()).toEqual([]);
    });

    it("returns empty array for an invalid token", () => {
      mockedGetAccessToken.mockReturnValue("invalid-token");
      expect(getUserRoles()).toEqual([]);
    });
  });

  describe("getUsername", () => {
    it("returns empty string when no token exists", () => {
      mockedGetAccessToken.mockReturnValue(null);
      expect(getUsername()).toBe("");
    });

    it("returns the username (sub) from a valid token", () => {
      const token = createToken({
        sub: "johndoe",
        roles: ["ROLE_USER"],
        exp: Math.floor(Date.now() / 1000) + 3600,
      });
      mockedGetAccessToken.mockReturnValue(token);
      expect(getUsername()).toBe("johndoe");
    });

    it("returns empty string for invalid token", () => {
      mockedGetAccessToken.mockReturnValue("invalid-token");
      expect(getUsername()).toBe("");
    });
  });

  describe("isTokenExpired", () => {
    it("returns true when no token exists", () => {
      mockedGetAccessToken.mockReturnValue(null);
      expect(isTokenExpired()).toBe(true);
    });

    it("returns false for a non-expired token", () => {
      const token = createToken({
        sub: "user",
        exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
      });
      mockedGetAccessToken.mockReturnValue(token);
      expect(isTokenExpired()).toBe(false);
    });

    it("returns true for an expired token", () => {
      const token = createToken({
        sub: "user",
        exp: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
      });
      mockedGetAccessToken.mockReturnValue(token);
      expect(isTokenExpired()).toBe(true);
    });
  });
});
