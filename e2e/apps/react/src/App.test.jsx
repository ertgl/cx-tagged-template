import "@testing-library/jest-dom/jest-globals";
import {
  render,
  screen,
} from "@testing-library/react";

import { App } from "./App";
import {
  cmx as logo$cmx,
  LOGO_DEFAULT_ALT,
} from "./components/logo";

test(
  "evaluates both css-modules and global class names",
  () =>
  {
    render(<App />);

    const reverseButton = screen.getByText(/reverse/i);
    expect(reverseButton).toBeInTheDocument();

    expect(reverseButton).not.toHaveClass("invert-1");

    const logo = screen.getByAltText(LOGO_DEFAULT_ALT);
    expect(logo).toBeInTheDocument();

    expect(logo).toHaveClass(logo$cmx`logo`);
    expect(logo).not.toHaveClass(logo$cmx`logo--reversed invert-1`);

    reverseButton.click();
    requestAnimationFrame(
      () =>
      {
        expect(logo).toHaveClass(logo$cmx`logo--reversed invert-1`);
        expect(reverseButton).toHaveClass("invert-1");
      },
    );

    reverseButton.click();
    requestAnimationFrame(
      () =>
      {
        expect(logo).not.toHaveClass(logo$cmx`logo--reversed invert-1`);
        expect(reverseButton).not.toHaveClass("invert-1");
      },
    );
  },
);
