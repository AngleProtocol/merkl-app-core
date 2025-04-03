import { useTheme } from "dappkit";
import { useMemo } from "react";

export interface BrandProps {
  children: (mode: "dark" | "light") => JSX.Element;
}

/**
 * Brand (logo) main display in the header
 * @notice prefer using svg imported
 */
export default function Brand({ children: getLogo }: BrandProps) {
  const { mode } = useTheme();

  const logo = useMemo(() => {
    getLogo(mode);
  }, [mode, getLogo]);

  return <>{logo}</>;
}
