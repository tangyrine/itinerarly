import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Chat from "../components/Chat";


describe("Chat Component", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("renders the chat component", () => {
    render(<Chat />);
    expect(screen.getByText(/Travel chat/i)).toBeInTheDocument();
  });

  it("opens the chat drawer when the button is clicked", () => {
    render(<Chat />);
    const button = screen.getByRole("button", { name: /Chat with us/i });
    fireEvent.click(button);
    expect(screen.getByText(/How can we help you today?/i)).toBeInTheDocument();
  });

  it("closes the chat drawer when the close button is clicked", () => {
    render(<Chat />);
    const button = screen.getByRole("button", { name: /Chat with us/i });
    fireEvent.click(button);
    const closeButton = screen.getByRole("button", { name: /Close chat/i });
    fireEvent.click(closeButton);
    expect(screen.queryByText(/How can we help you today?/i)).not.toBeInTheDocument();
  });
});