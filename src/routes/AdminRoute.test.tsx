import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { AdminRoute } from "./AdminRoute";

vi.mock("../context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from "../context/AuthContext";

const mockedUseAuth = vi.mocked(useAuth);

const renderWithRouter = (initialEntries: string[] = ["/admin"]) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<div>Admin Content</div>} />
        </Route>
        <Route path="/login" element={<div>Login Page</div>} />
        <Route path="/" element={<div>Home Page</div>} />
      </Routes>
    </MemoryRouter>,
  );
};

describe("AdminRoute", () => {
  it("renders child route when user is logged in and has ROLE_ADMIN", () => {
    mockedUseAuth.mockReturnValue({
      isLoggedIn: true,
      username: "admin",
      roles: ["ROLE_ADMIN"],
      login: vi.fn(),
      logout: vi.fn(),
    });

    renderWithRouter();
    expect(screen.getByText("Admin Content")).toBeInTheDocument();
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
    expect(screen.queryByText("Admin Content")).not.toBeInTheDocument();
  });

  it("redirects to / when user is logged in but not admin", () => {
    mockedUseAuth.mockReturnValue({
      isLoggedIn: true,
      username: "user",
      roles: ["ROLE_USER"],
      login: vi.fn(),
      logout: vi.fn(),
    });

    renderWithRouter();
    expect(screen.getByText("Home Page")).toBeInTheDocument();
    expect(screen.queryByText("Admin Content")).not.toBeInTheDocument();
  });
});
