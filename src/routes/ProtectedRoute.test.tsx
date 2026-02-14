import { render, screen } from "@testing-library/react";
import { MemoryRouter, Outlet, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { ProtectedRoute } from "./ProtectedRoute";

// Mock useAuth
vi.mock("../context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from "../context/AuthContext";

const mockedUseAuth = vi.mocked(useAuth);

const renderWithRouter = (initialEntries: string[] = ["/"]) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<div>Protected Content</div>} />
        </Route>
        <Route path="/login" element={<div>Login Page</div>} />
      </Routes>
    </MemoryRouter>,
  );
};

describe("ProtectedRoute", () => {
  it("renders child route when user is logged in", () => {
    mockedUseAuth.mockReturnValue({
      isLoggedIn: true,
      username: "testuser",
      roles: ["ROLE_USER"],
      login: vi.fn(),
      logout: vi.fn(),
    });

    renderWithRouter();
    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("redirects to /login when user is not logged in", () => {
    mockedUseAuth.mockReturnValue({
      isLoggedIn: false,
      username: "",
      roles: [],
      login: vi.fn(),
      logout: vi.fn(),
    });

    renderWithRouter();
    expect(screen.getByText("Login Page")).toBeInTheDocument();
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });
});
