import { DarkMode, LightMode } from "@chakra-ui/react";
import type { ReactNode } from "react";

export function ForceColorMode({
  darkMode,
  children,
}: {
  darkMode: boolean;
  children: ReactNode;
}) {
  return darkMode ? (
    <DarkMode>{children}</DarkMode>
  ) : (
    <LightMode>{children}</LightMode>
  );
}
