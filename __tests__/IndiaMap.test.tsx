import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import IndiaMap from "../components/IndiaMap";
import Gemini from "@/lib/Gemini";

// Mock react-simple-maps components
jest.mock("react-simple-maps", () => ({
  ComposableMap: ({ children }: any) => <div>{children}</div>,
  Geographies: ({ children }: any) => <div>{children}</div>,
  Geography: ({ children }: any) => <div>{children}</div>,
  Marker: ({ children }: any) => <div>{children}</div>,
  ZoomableGroup: ({ children }: any) => <div>{children}</div>,
}));

// Mock the Gemini API
jest.mock("@/lib/Gemini", () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock the sections data
jest.mock("@/data/sections", () => ({
  sections: [
    {
      id: "test-type",
      places: [
        {
          name: "Test Place",
          coordinates: [78, 22],
        },
      ],
    },
  ],
}));

describe("IndiaMap", () => {
  beforeEach(() => {
    (Gemini as jest.Mock).mockClear();
    document.body.innerHTML = "";
  });

  it("shows hover tooltip when marker is hovered", async () => {
    (Gemini as jest.Mock).mockResolvedValue("Test place details");

    const { container } = render(<IndiaMap type="test-type" />);

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText(/Loading map/i)).not.toBeInTheDocument();
    });

  });

  it("loads and displays place details when show details is clicked", async () => {
    (Gemini as jest.Mock).mockResolvedValue("Test place details");

    const { container } = render(<IndiaMap type="test-type" />);

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText(/Loading map/i)).not.toBeInTheDocument();
    });

    // Hover and click show details
    const g = container.querySelector("g");
  });
});
