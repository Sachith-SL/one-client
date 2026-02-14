import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi, beforeEach } from "vitest";
import EmployeeDetail from "./EmployeeDetail";

vi.mock("../services/EmployeeService", () => ({
  getEmployeeByIdApi: vi.fn(),
  updateEmployeeApi: vi.fn(),
}));

vi.mock("../services/DepartmentService", () => ({
  getAllDepartmentsApi: vi.fn(),
}));

import {
  getEmployeeByIdApi,
  updateEmployeeApi,
} from "../services/EmployeeService";
import { getAllDepartmentsApi } from "../services/DepartmentService";

const mockedGetEmployeeById = vi.mocked(getEmployeeByIdApi);
const mockedUpdateEmployee = vi.mocked(updateEmployeeApi);
const mockedGetAllDepartments = vi.mocked(getAllDepartmentsApi);

const mockEmployee = { id: 1, name: "Alice", departmentId: 1, salary: 5000 };
const mockDepartments = [
  { id: 1, name: "Engineering" },
  { id: 2, name: "Marketing" },
];

const renderEmployeeDetail = () => {
  return render(
    <MemoryRouter initialEntries={["/employee/1"]}>
      <Routes>
        <Route path="/employee/:id" element={<EmployeeDetail />} />
      </Routes>
    </MemoryRouter>,
  );
};

describe("EmployeeDetail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.alert = vi.fn();
    mockedGetEmployeeById.mockResolvedValue(mockEmployee);
    mockedGetAllDepartments.mockResolvedValue(mockDepartments);
  });

  it("renders employee detail heading with id", async () => {
    renderEmployeeDetail();
    expect(screen.getByText(/Employee Detail ID: 1/)).toBeInTheDocument();
  });

  it("loads and displays employee data", async () => {
    renderEmployeeDetail();

    await waitFor(() => {
      expect(screen.getByDisplayValue("Alice")).toBeInTheDocument();
      expect(screen.getByDisplayValue("5000")).toBeInTheDocument();
    });
  });

  it("fields are read-only by default", async () => {
    renderEmployeeDetail();

    await waitFor(() => {
      expect(screen.getByDisplayValue("Alice")).toBeInTheDocument();
    });

    expect(screen.getByDisplayValue("Alice")).toHaveAttribute("readonly");
    expect(screen.getByDisplayValue("5000")).toHaveAttribute("readonly");
  });

  it("enables editing when Edit button is clicked", async () => {
    const user = userEvent.setup();
    renderEmployeeDetail();

    await waitFor(() => {
      expect(screen.getByDisplayValue("Alice")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /edit/i }));

    expect(screen.getByDisplayValue("Alice")).not.toHaveAttribute("readonly");
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
  });

  it("calls updateEmployee when Save is clicked", async () => {
    const user = userEvent.setup();
    mockedUpdateEmployee.mockResolvedValue(undefined);

    renderEmployeeDetail();

    await waitFor(() => {
      expect(screen.getByDisplayValue("Alice")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /edit/i }));

    const nameInput = screen.getByDisplayValue("Alice");
    await user.clear(nameInput);
    await user.type(nameInput, "Alice Updated");

    await user.click(screen.getByRole("button", { name: /save/i }));

    expect(mockedUpdateEmployee).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ name: "Alice Updated" }),
    );
  });
});
