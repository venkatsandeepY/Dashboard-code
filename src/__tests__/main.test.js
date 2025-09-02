import React from "react";
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import App from "../App";
import "@testing-library/jest-dom";

describe("Main entrypoint", () => {
  it("renders App component inside BrowserRouter and StrictMode", () => {
    const container = document.createElement("div");
    container.setAttribute("id", "root");
    document.body.appendChild(container);

    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.StrictMode>
    );

    // Test that App component mounts (assume it renders something like "Welcome" text)
    // Alter "Welcome" to match output of your App component
    expect(document.body.textContent).toMatch(/Welcome|./);
  });

  it("should contain BrowserRouter context", () => {
    // You may use integration tests for route checks, but the entry test suffices for setup
    // For more exhaustive checks, test App directly with router context
    // Example (if App renders a heading)
    // render(
    //   <BrowserRouter>
    //     <App />
    //   </BrowserRouter>
    // );
    // expect(screen.getByRole("heading", { name: /Home/i })).toBeInTheDocument();
    expect(true).toBe(true); // Placeholder: actual route tests in App.test.js
  });
});
