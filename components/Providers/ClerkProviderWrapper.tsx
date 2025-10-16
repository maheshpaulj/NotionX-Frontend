"use client";

import { ClerkProvider } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import { ReactNode } from "react";

export const ClerkProviderWrapper = ({ children }: { children: ReactNode }) => {
  const { theme } = useTheme();
  
  return (
    <ClerkProvider
      publishableKey="pk_test_c29saWQtYm9uZWZpc2gtNTQuY2xlcmsuYWNjb3VudHMuZGV2JA"
      appearance={{
        baseTheme: theme === "dark" ? dark : undefined,
      }}
    >
      {children}
    </ClerkProvider>
  );
};