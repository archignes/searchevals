import { useState, useEffect } from "react";
import { useIsomorphicLayoutEffect } from "react-use";

export const useWindowResize = () => {
  const [size, setSize] = useState([0, 0]);

  useEffect(() => {
    setSize([window.innerWidth, window.innerHeight]);
  }, []);

  useIsomorphicLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }

    window.addEventListener("resize", updateSize);
    updateSize();

    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return size;
};