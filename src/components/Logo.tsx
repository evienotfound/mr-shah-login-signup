import React from "react";

// Mr Shah Brand Logo Component
// Uses Playfair Display for elegant, masculine branding

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = "md", className = "" }) => {
  // Size configurations
  const sizes = {
    sm: "text-xl",
    md: "text-3xl",
    lg: "text-5xl",
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Main logo text */}
      <h1 className={`font-display font-bold text-foreground ${sizes[size]} tracking-wider`}>
        MR SHAH
      </h1>
      
      {/* Tagline with gold accent */}
      <div className="flex items-center gap-3 mt-1">
        <span className="w-8 h-px bg-accent" />
        <span className="text-xs font-sans tracking-[0.3em] text-muted-foreground uppercase">
          Men's Clothing
        </span>
        <span className="w-8 h-px bg-accent" />
      </div>
    </div>
  );
};

export default Logo;
