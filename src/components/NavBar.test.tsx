import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi, beforeEach } from "vitest";
import NavBar from "./NavBar";

vi.mock("../context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from "../context/AuthContext";

const mockedUseAuth = vi.mocked(useAuth);

const renderNavBar = () => {
  return render(
    <MemoryRouter>
      <NavBar />
    </MemoryRouter>,
  );
};

describe("NavBar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows Register and Login buttons when not logged in", () => {
    mockedUseAuth.mockReturnValue({
      isLoggedIn: false,
      username: "",
      roles: [],
      login: vi.fn(),
      logout: vi.fn(),
    });

    renderNavBar();
    expect(
      screen.getByRole("button", { name: /register/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /logout/i }),
    ).not.toBeInTheDocument();
  });

  it("shows username and Logout button when logged in", () => {
    mockedUseAuth.mockReturnValue({
      isLoggedIn: true,
      username: "johndoe",
      roles: ["ROLE_USER"],
      login: vi.fn(),
      logout: vi.fn(),
    });

    renderNavBar();
    expect(screen.getByText(/johndoe/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /login/i }),
    ).not.toBeInTheDocument();
  });

  it("shows Employee List link when logged in", () => {
    mockedUseAuth.mockReturnValue({
      isLoggedIn: true,
      username: "user",
      roles: ["ROLE_USER"],
      login: vi.fn(),
      logout: vi.fn(),
    });

    renderNavBar();
    expect(screen.getByText("Employee List")).toBeInTheDocument();
  });

  it("does not show Employee List link when not logged in", () => {
    mockedUseAuth.mockReturnValue({
      isLoggedIn: false,
      username: "",
      roles: [],
      login: vi.fn(),
      logout: vi.fn(),
    });

    renderNavBar();
    expect(screen.queryByText("Employee List")).not.toBeInTheDocument();
  });

  it("shows admin links (New, Manage Users) for admin users", () => {
    mockedUseAuth.mockReturnValue({
      isLoggedIn: true,
      username: "admin",
      roles: ["ROLE_ADMIN"],
      login: vi.fn(),
      logout: vi.fn(),
    });

    renderNavBar();
    expect(screen.getByText("New")).toBeInTheDocument();
    expect(screen.getByText("Manage Users")).toBeInTheDocument();
  });

  it("does not show admin links for regular users", () => {
    mockedUseAuth.mockReturnValue({
      isLoggedIn: true,
      username: "user",
      roles: ["ROLE_USER"],
      login: vi.fn(),
      logout: vi.fn(),
    });

    renderNavBar();
    expect(screen.queryByText("New")).not.toBeInTheDocument();
    expect(screen.queryByText("Manage Users")).not.toBeInTheDocument();
  });

  it("calls logout when Logout button is clicked", async () => {
    const mockLogout = vi.fn();
    mockedUseAuth.mockReturnValue({
      isLoggedIn: true,
      username: "user",
      roles: ["ROLE_USER"],
      login: vi.fn(),
      logout: mockLogout,
    });

    const user = userEvent.setup();
    renderNavBar();

    await user.click(screen.getByRole("button", { name: /logout/i }));
    expect(mockLogout).toHaveBeenCalled();
  });
});
