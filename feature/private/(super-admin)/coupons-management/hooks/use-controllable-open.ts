import { useState } from "react";

export function useControllableOpen(
  controlledOpen: boolean | undefined,
  setControlledOpen?: (open: boolean) => void,
) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen;
  const setIsOpen = (val: boolean) => {
    if (isControlled) {
      setControlledOpen?.(val);
    } else {
      setUncontrolledOpen(val);
    }
  };
  return { isOpen, setIsOpen };
}
