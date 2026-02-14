import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi, beforeEach } from "vitest";
import EmployeeList from "./EmployeeList";

vi.mock("../services/EmployeeService", () => ({
  getAllEmployeesApi: vi.fn(),
  deleteEmployeeApi: vi.fn(),
}));

vi.mock("../services/DepartmentService", () => ({
  getAllDepartmentsApi: vi.fn(),
}));

vi.mock("../context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

import {
  getAllEmployeesApi,
  deleteEmployeeApi,
} from "../services/EmployeeService";
import { getAllDepartmentsApi } from "../services/DepartmentService";
import { useAuth } from "../context/AuthContext";

const mockedGetAllEmployees = vi.mocked(getAllEmployeesApi);
const mockedGetAllDepartments = vi.mocked(getAllDepartmentsApi);
const mockedDeleteEmployee = vi.mocked(deleteEmployeeApi);
const mockedUseAuth = vi.mocked(useAuth);

const mockEmployees = [
  { id: 1, name: "Alice", departmentId: 1, salary: 5000 },
  { id: 2, name: "Bob", departmentId: 2, salary: 6000 },
];

const mockDepartments = [
  { id: 1, name: "Engineering" },
  { id: 2, name: "Marketing" },
];

const renderEmployeeList = (roles: string[] = ["ROLE_USER"]) => {
  mockedUseAuth.mockReturnValue({
    isLoggedIn: true,
    username: "testuser",
    roles,
    login: vi.fn(),
    logout: vi.fn(),
  });

  return render(
    <MemoryRouter initialEntries={["/employee-list"]}>
      <Routes>
        <Route path="/employee-list" element={<EmployeeList />} />
        <Route path="/employee/:id" element={<div>Employee Detail</div>} />
      </Routes>
    </MemoryRouter>,
  );
};

describe("EmployeeList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.alert = vi.fn();
    mockedGetAllEmployees.mockResolvedValue(mockEmployees);
    mockedGetAllDepartments.mockResolvedValue(mockDepartments);
  });

  it("renders the employee list heading", async () => {
    renderEmployeeList();
    expect(screen.getByText("EmployeeList")).toBeInTheDocument();
  });

  it("displays employees after loading", async () => {
    renderEmployeeList();

    await waitFor(() => {
      expect(screen.getByText("Alice")).toBeInTheDocument();
      expect(screen.getByText("Bob")).toBeInTheDocument();
    });
  });

  it("maps department names correctly", async () => {
    renderEmployeeList();

    await waitFor(() => {
      expect(screen.getByText("Engineering")).toBeInTheDocument();
      expect(screen.getByText("Marketing")).toBeInTheDocument();
    });
  });

  it("shows Details and Delete buttons for admin", async () => {
    renderEmployeeList(["ROLE_ADMIN"]);

    await waitFor(() => {
      expect(screen.getAllByRole("button", { name: /details/i })).toHaveLength(
        2,
      );
      expect(screen.getAllByRole("button", { name: /delete/i })).toHaveLength(
        2,
      );
    });
  });

  it("does not show Details and Delete buttons for non-admin", async () => {
    renderEmployeeList(["ROLE_USER"]);

    await waitFor(() => {
      expect(screen.getByText("Alice")).toBeInTheDocument();
    });

    expect(
      screen.queryByRole("button", { name: /details/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /delete/i }),
    ).not.toBeInTheDocument();
  });

  it("calls deleteEmployee when Delete is clicked", async () => {
    mockedDeleteEmployee.mockResolvedValue(undefined);

    const user = userEvent.setup();
    renderEmployeeList(["ROLE_ADMIN"]);

    await waitFor(() => {
      expect(screen.getByText("Alice")).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    await user.click(deleteButtons[0]);

    await waitFor(() => {
      expect(mockedDeleteEmployee).toHaveBeenCalledWith(1);
    });
  });
});
