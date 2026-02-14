import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi, beforeEach } from "vitest";
import Register from "./Register";

vi.mock("../services/RegisterService", () => ({
  registerApi: vi.fn(),
}));

import { registerApi } from "../services/RegisterService";

const mockedRegister = vi.mocked(registerApi);

const renderRegister = () => {
  return render(
    <MemoryRouter initialEntries={["/register"]}>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<div>Home Page</div>} />
      </Routes>
    </MemoryRouter>,
  );
};

describe("Register", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.alert = vi.fn();
  });

  it("renders the registration form", () => {
    renderRegister();
    expect(
      screen.getByText("Register", { selector: "h2" }),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /register/i }),
    ).toBeInTheDocument();
  });

  it("allows user to type username and password", async () => {
    const user = userEvent.setup();
    renderRegister();

    await user.type(screen.getByPlaceholderText("Username"), "newuser");
    await user.type(screen.getByPlaceholderText("Password"), "pass123");

    expect(screen.getByPlaceholderText("Username")).toHaveValue("newuser");
    expect(screen.getByPlaceholderText("Password")).toHaveValue("pass123");
  });

  it("calls register service on submit", async () => {
    const user = userEvent.setup();
    mockedRegister.mockResolvedValue(undefined);

    renderRegister();

    await user.type(screen.getByPlaceholderText("Username"), "newuser");
    await user.type(screen.getByPlaceholderText("Password"), "pass123");
    await user.click(screen.getByRole("button", { name: /register/i }));

    expect(mockedRegister).toHaveBeenCalledWith("newuser", "pass123");
  });

  it("shows alert on failed registration", async () => {
    const user = userEvent.setup();
    mockedRegister.mockRejectedValue(new Error("fail"));

    renderRegister();

    await user.type(screen.getByPlaceholderText("Username"), "newuser");
    await user.type(screen.getByPlaceholderText("Password"), "pass123");
    await user.click(screen.getByRole("button", { name: /register/i }));

    await vi.waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Registration failed");
    });
  });
});
