import * as React from "react";
import { cn } from "@/lib/utils";

// Custom input component for authentication forms
// Styled specifically for the Mr Shah brand aesthetic

export interface AuthInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const AuthInput = React.forwardRef<HTMLInputElement, AuthInputProps>(
  ({ className, type, label, error, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {/* Label with elegant serif font */}
        <label className="block text-sm font-medium text-foreground font-sans tracking-wide">
          {label}
        </label>
        
        {/* Input field with premium styling */}
        <input
          type={type}
          className={cn(
            // Base styles
            "flex h-12 w-full rounded-sm border bg-card px-4 py-3",
            // Typography
            "font-sans text-sm text-foreground placeholder:text-muted-foreground",
            // Border and focus states
            "border-border transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent",
            // Disabled state
            "disabled:cursor-not-allowed disabled:opacity-50",
            // Error state
            error && "border-destructive focus:ring-destructive",
            className
          )}
          ref={ref}
          {...props}
        />
        
        {/* Error message display */}
        {error && (
          <p className="text-xs text-destructive font-sans animate-fade-in">
            {error}
          </p>
        )}
      </div>
    );
  }
);

AuthInput.displayName = "AuthInput";

export { AuthInput };
