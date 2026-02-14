import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi, beforeEach } from "vitest";
import Login from "./Login";

// Mock LoginService
vi.mock("../services/LoginService", () => ({
  loginApi: vi.fn(),
}));

// Mock AuthContext
vi.mock("../context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

import { loginApi } from "../services/LoginService";
import { useAuth } from "../context/AuthContext";

const mockedLoginApi = vi.mocked(loginApi);
const mockedUseAuth = vi.mocked(useAuth);

const mockLogin = vi.fn();

const renderLogin = () => {
  mockedUseAuth.mockReturnValue({
    isLoggedIn: false,
    username: "",
    roles: [],
    login: mockLogin,
    logout: vi.fn(),
  });

  return render(
    <MemoryRouter initialEntries={["/login"]}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<div>Home Page</div>} />
      </Routes>
    </MemoryRouter>,
  );
};

describe("Login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.alert = vi.fn();
  });

  it("renders the login form", () => {
    renderLogin();
    expect(screen.getByText("Login", { selector: "h2" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("allows user to type username and password", async () => {
    const user = userEvent.setup();
    renderLogin();

    const usernameInput = screen.getByPlaceholderText("Username");
    const passwordInput = screen.getByPlaceholderText("Password");

    await user.type(usernameInput, "testuser");
    await user.type(passwordInput, "secret123");

    expect(usernameInput).toHaveValue("testuser");
    expect(passwordInput).toHaveValue("secret123");
  });

  it("calls loginApi and login on successful submit", async () => {
    const user = userEvent.setup();
    mockedLoginApi.mockResolvedValue({ accessToken: "fake-jwt-token" });

    renderLogin();

    await user.type(screen.getByPlaceholderText("Username"), "admin");
    await user.type(screen.getByPlaceholderText("Password"), "password");
    await user.click(screen.getByRole("button", { name: /login/i }));

    expect(mockedLoginApi).toHaveBeenCalledWith({
      username: "admin",
      password: "password",
    });
    expect(mockLogin).toHaveBeenCalledWith("fake-jwt-token");
  });

  it("displays error on failed login", async () => {
    const user = userEvent.setup();
    mockedLoginApi.mockRejectedValue({
      response: { data: { status: "Invalid credentials" } },
    });

    renderLogin();

    await user.type(screen.getByPlaceholderText("Username"), "bad");
    await user.type(screen.getByPlaceholderText("Password"), "wrong");
    await user.click(screen.getByRole("button", { name: /login/i }));

    expect(await screen.findByText("Invalid credentials")).toBeInTheDocument();
  });
});
