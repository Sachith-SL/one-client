import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi, beforeEach } from "vitest";
import AdminUsersPage from "./AdminUsersPage";

vi.mock("../../services/AdminService", () => ({
  getAllUsersApi: vi.fn(),
  assignRoleApi: vi.fn(),
}));

import { getAllUsersApi, assignRoleApi } from "../../services/AdminService";

const mockedGetAllUsers = vi.mocked(getAllUsersApi);
const mockedAssignRole = vi.mocked(assignRoleApi);

const mockUsers = [
  { id: 1, username: "admin", roles: ["ROLE_ADMIN"] },
  { id: 2, username: "user1", roles: ["ROLE_USER"] },
];

const renderAdminUsersPage = () => {
  return render(
    <MemoryRouter>
      <AdminUsersPage />
    </MemoryRouter>,
  );
};

describe("AdminUsersPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.alert = vi.fn();
    mockedGetAllUsers.mockResolvedValue(mockUsers);
  });

  it("renders the heading", () => {
    renderAdminUsersPage();
    expect(screen.getByText("User Management")).toBeInTheDocument();
  });

  it("displays users after loading", async () => {
    renderAdminUsersPage();

    await waitFor(() => {
      expect(screen.getByText("admin")).toBeInTheDocument();
      expect(screen.getByText("user1")).toBeInTheDocument();
    });
  });

  it("displays user roles", async () => {
    renderAdminUsersPage();

    await waitFor(() => {
      expect(screen.getByText("ROLE_ADMIN")).toBeInTheDocument();
      expect(screen.getByText("ROLE_USER")).toBeInTheDocument();
    });
  });

  it("calls assignRole when a role is selected", async () => {
    const user = userEvent.setup();
    mockedAssignRole.mockResolvedValue(undefined);

    renderAdminUsersPage();

    await waitFor(() => {
      expect(screen.getByText("user1")).toBeInTheDocument();
    });

    const selects = screen.getAllByDisplayValue("Select");
    await user.selectOptions(selects[1], "ADMIN");

    expect(mockedAssignRole).toHaveBeenCalledWith(2, "ADMIN");
  });
});
