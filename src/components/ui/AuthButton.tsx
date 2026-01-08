import * as React from "react";
import { cn } from "@/lib/utils";

// Premium button component for authentication forms
// Features the Mr Shah gold accent color

export interface AuthButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  isLoading?: boolean;
}

const AuthButton = React.forwardRef<HTMLButtonElement, AuthButtonProps>(
  ({ className, variant = "primary", isLoading, children, disabled, ...props }, ref) => {
    // Define variant styles using design system tokens
    const variants = {
      // Primary: Gold background, dark text - main CTA
      primary: cn(
        "bg-accent text-accent-foreground",
        "hover:brightness-110",
        "shadow-md hover:shadow-lg"
      ),
      // Secondary: Dark background, light text
      secondary: cn(
        "bg-primary text-primary-foreground",
        "hover:bg-charcoal-light"
      ),
      // Outline: Transparent with border
      outline: cn(
        "bg-transparent border-2 border-accent text-accent",
        "hover:bg-accent hover:text-accent-foreground"
      ),
    };

    return (
      <button
        className={cn(
          // Base styles
          "inline-flex items-center justify-center",
          "h-12 px-8 py-3 w-full",
          "rounded-sm font-sans font-medium tracking-wide text-sm",
          // Transitions
          "transition-all duration-200 ease-in-out",
          // Focus state
          "focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2",
          // Disabled state
          "disabled:opacity-50 disabled:cursor-not-allowed",
          // Apply variant styles
          variants[variant],
          className
        )}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {/* Loading spinner */}
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Processing...
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

AuthButton.displayName = "AuthButton";

export { AuthButton };
