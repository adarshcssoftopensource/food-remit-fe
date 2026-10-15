import * as React from "react";

// Treats tablets (< 1280px / xl) and mobiles with overlay drawer sidebar closed by default
const MOBILE_BREAKPOINT = 1280;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    const legacyMql = mql as MediaQueryList & {
      addListener?: (cb: () => void) => void;
      removeListener?: (cb: () => void) => void;
    };
    if (mql.addEventListener) {
      mql.addEventListener("change", onChange);
    } else if (legacyMql.addListener) {
      legacyMql.addListener(onChange);
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener("change", onChange);
      } else if (legacyMql.removeListener) {
        legacyMql.removeListener(onChange);
      }
    };
  }, []);

  return !!isMobile;
}
