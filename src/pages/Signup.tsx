import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AuthInput } from "@/components/ui/AuthInput";
import { AuthButton } from "@/components/ui/AuthButton";
import Logo from "@/components/Logo";
import heroBg from "@/assets/hero-bg.jpg";

// Signup Page Component for Mr Shah Men's Clothing Store
// Features all required fields: Full Name, Email, Mobile, Password, Confirm Password

const Signup: React.FC = () => {
  // State for all form fields
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  // State for validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validate form before submission
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Full name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.length < 2) {
      newErrors.fullName = "Name must be at least 2 characters";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    // Mobile validation (10 digits)
    const mobileRegex = /^[0-9]{10}$/;
    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!mobileRegex.test(formData.mobile)) {
      newErrors.mobile = "Please enter a valid 10-digit mobile number";
    }

    // Password validation (minimum 6 characters)
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError("");

    // Validate form
    if (!validateForm()) {
      return;
    }

    // Simulate signup (in real app, this sends to PHP backend)
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert("Account created successfully! (This is a demo - real signup uses PHP backend)");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md animate-fade-in">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8">
            <Logo size="md" />
          </div>

          {/* Form header */}
          <div className="mb-8">
            <h2 className="font-display text-3xl font-bold text-foreground mb-2">
              Create Account
            </h2>
            <p className="font-sans text-muted-foreground">
              Join Mr Shah for exclusive offers and updates
            </p>
          </div>

          {/* General error message */}
          {generalError && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-sm animate-fade-in">
              <p className="text-sm text-destructive font-sans">{generalError}</p>
            </div>
          )}

          {/* Signup form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <AuthInput
              label="Full Name"
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              error={errors.fullName}
            />

            <AuthInput
              label="Email Address"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />

            <AuthInput
              label="Mobile Number"
              type="tel"
              name="mobile"
              placeholder="Enter 10-digit mobile number"
              value={formData.mobile}
              onChange={handleChange}
              error={errors.mobile}
            />

            <AuthInput
              label="Password"
              type="password"
              name="password"
              placeholder="Create a password (min 6 characters)"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
            />

            <AuthInput
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
            />

            {/* Terms and conditions */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                required
                className="mt-1 h-4 w-4 rounded border-border text-accent focus:ring-accent"
              />
              <label htmlFor="terms" className="text-sm font-sans text-muted-foreground">
                I agree to the{" "}
                <a href="#" className="text-accent hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-accent hover:underline">
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Submit button */}
            <AuthButton type="submit" isLoading={isLoading}>
              Create Account
            </AuthButton>
          </form>

          {/* Sign in link */}
          <p className="mt-8 text-center font-sans text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-accent font-medium hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Hero Image */}
      <div 
        className="hidden lg:flex lg:w-1/2 relative bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-primary/70" />
        
        {/* Hero content */}
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-center">
          <Logo size="lg" className="text-primary-foreground mb-8" />
          
          <p className="font-sans text-primary-foreground/80 text-lg max-w-md leading-relaxed">
            Join our community of distinguished gentlemen. Exclusive access to new collections and special offers.
          </p>
          
          {/* Features list */}
          <div className="mt-12 space-y-4 text-left">
            {[
              "Free shipping on orders over ₹999",
              "Exclusive member discounts",
              "Early access to new arrivals",
              "Easy returns & exchanges",
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3 animate-slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <span className="w-2 h-2 rounded-full bg-accent" />
                <span className="text-primary-foreground/80 font-sans text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
