import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi, beforeEach } from "vitest";
import CreateEmployee from "./CreateEmployee";

vi.mock("../services/DepartmentService", () => ({
  getAllDepartmentsApi: vi.fn(),
}));

vi.mock("../services/EmployeeService", () => ({
  createEmployeeApi: vi.fn(),
}));

import { getAllDepartmentsApi } from "../services/DepartmentService";
import { createEmployeeApi } from "../services/EmployeeService";

const mockedGetAllDepartments = vi.mocked(getAllDepartmentsApi);
const mockedCreateEmployee = vi.mocked(createEmployeeApi);

const mockDepartments = [
  { id: 1, name: "Engineering" },
  { id: 2, name: "Marketing" },
];

const renderCreateEmployee = () => {
  return render(
    <MemoryRouter initialEntries={["/create-employee"]}>
      <Routes>
        <Route path="/create-employee" element={<CreateEmployee />} />
        <Route path="/" element={<div>Home Page</div>} />
      </Routes>
    </MemoryRouter>,
  );
};

describe("CreateEmployee", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.alert = vi.fn();
    mockedGetAllDepartments.mockResolvedValue(mockDepartments);
  });

  it("renders the create employee form", async () => {
    renderCreateEmployee();
    expect(
      screen.getByText("Create Employee", { selector: "h2" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /name/i })).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: /department/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("spinbutton", { name: /salary/i }),
    ).toBeInTheDocument();
  });

  it("loads departments into the dropdown", async () => {
    renderCreateEmployee();

    await waitFor(() => {
      expect(screen.getByText("Engineering")).toBeInTheDocument();
      expect(screen.getByText("Marketing")).toBeInTheDocument();
    });
  });

  it("allows user to fill the form", async () => {
    const user = userEvent.setup();
    renderCreateEmployee();

    const nameInput = screen.getByRole("textbox", { name: /name/i });
    await user.type(nameInput, "Charlie");
    expect(nameInput).toHaveValue("Charlie");
  });

  it("calls createEmployee on submit", async () => {
    const user = userEvent.setup();
    mockedCreateEmployee.mockResolvedValue(undefined);

    renderCreateEmployee();

    await waitFor(() => {
      expect(screen.getByText("Engineering")).toBeInTheDocument();
    });

    await user.type(screen.getByRole("textbox", { name: /name/i }), "Charlie");
    await user.selectOptions(
      screen.getByRole("combobox", { name: /department/i }),
      "1",
    );
    await user.clear(screen.getByRole("spinbutton", { name: /salary/i }));
    await user.type(
      screen.getByRole("spinbutton", { name: /salary/i }),
      "7000",
    );

    await user.click(screen.getByRole("button", { name: /create employee/i }));

    expect(mockedCreateEmployee).toHaveBeenCalled();
  });

  it("navigates home on Cancel click", async () => {
    const user = userEvent.setup();
    renderCreateEmployee();

    await user.click(screen.getByRole("button", { name: /cancel/i }));
    expect(screen.getByText("Home Page")).toBeInTheDocument();
  });

  it("shows alert on creation failure", async () => {
    const user = userEvent.setup();
    mockedCreateEmployee.mockRejectedValue(new Error("fail"));

    renderCreateEmployee();

    await user.click(screen.getByRole("button", { name: /create employee/i }));

    await vi.waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Failed to create employee");
    });
  });
});
