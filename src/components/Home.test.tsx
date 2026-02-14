import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi, beforeEach } from "vitest";
import Home from "./Home";

vi.mock("../services/HomeService", () => ({
  getWelcomeMessageApi: vi.fn(),
}));

import { getWelcomeMessageApi } from "../services/HomeService";

const mockedGetWelcomeMessage = vi.mocked(getWelcomeMessageApi);

const renderHome = () => {
  return render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>,
  );
};

describe("Home", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading initially", () => {
    mockedGetWelcomeMessage.mockReturnValue(new Promise(() => {})); // never resolves
    renderHome();
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("displays the welcome message after loading", async () => {
    mockedGetWelcomeMessage.mockResolvedValue("Welcome to One App!");
    renderHome();

    await waitFor(() => {
      expect(screen.getByText("Welcome to One App!")).toBeInTheDocument();
    });
  });

  it("stops loading on error", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockedGetWelcomeMessage.mockRejectedValue(new Error("Network error"));
    renderHome();

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });
    consoleSpy.mockRestore();
  });
});
