import {
  useCallback,
  useState,
} from "react";

import { Logo } from "./components/logo";
import { cx } from "./utils/css";

export function App()
{
  const [isReversed, setIsReversed] = useState(false);

  const toggleIsReversed = useCallback(
    () =>
    {
      const handle = requestAnimationFrame(
        () =>
        {
          setIsReversed(
            (isReversed) => !isReversed,
          );
        },
      );

      return () =>
      {
        cancelAnimationFrame(handle);
      };
    },
    [
      setIsReversed,
    ],
  );

  return (
    <>
      <Logo
        reverse={isReversed}
      />
      <button
        className={cx`invert-1 ${isReversed}`}
        onClick={toggleIsReversed}
      >
        Reverse
      </button>
    </>
  );
}
