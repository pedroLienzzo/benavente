import "next-themes"

declare module "next-themes" {
  export interface ThemeProviderProps {
    target?: "html" | "body";
  }
} 