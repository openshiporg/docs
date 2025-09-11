import { useEffect, useState } from "react";

function detectWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl")
    );
  } catch {
    return false;
  }
}

export function useIsWebGLAvailable() {
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    setAvailable(detectWebGL());
  }, []);

  return available;
}