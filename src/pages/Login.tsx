import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AuthInput } from "@/components/ui/AuthInput";
import { AuthButton } from "@/components/ui/AuthButton";
import Logo from "@/components/Logo";
import heroBg from "@/assets/hero-bg.jpg";

// Login Page Component for Mr Shah Men's Clothing Store
// This is a React UI preview - actual authentication uses PHP backend

const Login: React.FC = () => {
  // State management for form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Form validation and submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    // Simulate login (in real app, this sends to PHP backend)
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Show success message for demo
      alert("Login successful! (This is a demo - real authentication uses PHP backend)");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Hero Image */}
      <div 
        className="hidden lg:flex lg:w-1/2 relative bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-primary/70" />
        
        {/* Hero content */}
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-center">
          <Logo size="lg" className="text-primary-foreground mb-8" />
          
          <p className="font-sans text-primary-foreground/80 text-lg max-w-md leading-relaxed">
            Experience the finest in men's fashion. Quality craftsmanship meets timeless elegance.
          </p>
          
          {/* Decorative element */}
          <div className="mt-12 flex items-center gap-4">
            <div className="w-16 h-px bg-accent" />
            <span className="text-accent font-display text-sm">EST. 2024</span>
            <div className="w-16 h-px bg-accent" />
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md animate-fade-in">
          {/* Mobile logo (hidden on desktop) */}
          <div className="lg:hidden mb-8">
            <Logo size="md" />
          </div>

          {/* Form header */}
          <div className="mb-8">
            <h2 className="font-display text-3xl font-bold text-foreground mb-2">
              Welcome Back
            </h2>
            <p className="font-sans text-muted-foreground">
              Sign in to access your account
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-sm animate-fade-in">
              <p className="text-sm text-destructive font-sans">{error}</p>
            </div>
          )}

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <AuthInput
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <AuthInput
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {/* Forgot password link */}
            <div className="flex justify-end">
              <a href="#" className="text-sm font-sans text-accent hover:underline">
                Forgot password?
              </a>
            </div>

            {/* Submit button */}
            <AuthButton type="submit" isLoading={isLoading}>
              Sign In
            </AuthButton>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center">
            <div className="flex-1 h-px bg-border" />
            <span className="px-4 text-sm text-muted-foreground font-sans">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Sign up link */}
          <p className="text-center font-sans text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="text-accent font-medium hover:underline">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
