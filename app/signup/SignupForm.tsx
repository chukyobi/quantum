"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Shield,
  Zap,
  Globe,
} from "lucide-react";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";

// Interactive particles that respond to form progress
const generateInteractiveParticles = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    speed: Math.random() * 0.5 + 0.2,
    angle: Math.random() * Math.PI * 2,
    opacity: Math.random() * 0.6 + 0.2,
    color: i % 3 === 0 ? "emerald" : i % 3 === 1 ? "purple" : "teal",
  }));
};

// Floating UI elements that orbit around the form
const floatingElements = [
  {
    icon: Shield,
    label: "Quantum Security",
    angle: 0,
    radius: 300,
    color: "emerald",
  },
  {
    icon: Zap,
    label: "Instant Setup",
    angle: 120,
    radius: 280,
    color: "purple",
  },
  {
    icon: Globe,
    label: "Global Access",
    angle: 240,
    radius: 320,
    color: "teal",
  },
];

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    signInWithGoogle,
    isLoading: isGoogleLoading,
    error: googleError,
  } = useGoogleAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState(() =>
    generateInteractiveParticles(50)
  );
  const [formProgress, setFormProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    general: "",
  });

  // Ensure client-side rendering for animations
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Mouse tracking for 3D effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: (e.clientX - rect.left - rect.width / 2) / rect.width,
          y: (e.clientY - rect.top - rect.height / 2) / rect.height,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Calculate form progress
  useEffect(() => {
    const fields = [
      formData.name,
      formData.email,
      formData.password,
      formData.confirmPassword,
    ];
    const filledFields = fields.filter((field) => field.trim() !== "").length;
    setFormProgress((filledFields / fields.length) * 100);
  }, [formData]);

  // Animate particles based on form progress
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles((prev) =>
        prev.map((particle) => ({
          ...particle,
          x: (particle.x + particle.speed * Math.cos(particle.angle)) % 100,
          y: (particle.y + particle.speed * Math.sin(particle.angle)) % 100,
          opacity: 0.2 + (formProgress / 100) * 0.6,
        }))
      );
    }, 50);

    return () => clearInterval(interval);
  }, [formProgress]);

  // Check for OAuth errors
  useEffect(() => {
    if (!searchParams) return;

    const error = searchParams.get("error");
    if (error) {
      const errorMessages = {
        oauth_error: "Google sign-in was cancelled or failed",
        missing_code: "Google sign-in failed - missing authorization code",
        invalid_state: "Google sign-in failed - security check failed",
        oauth_callback_failed: "Google sign-in failed - please try again",
      };

      setErrors((prev) => ({
        ...prev,
        general:
          errorMessages[error as keyof typeof errorMessages] ||
          "Sign-in failed",
      }));
    }
  }, [searchParams]);

  // Password validation
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const isPasswordValid = passwordRegex.test(formData.password);
  const isConfirmPasswordValid =
    formData.confirmPassword === formData.password &&
    formData.confirmPassword !== "";

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      general: "",
    };

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!isPasswordValid) {
      newErrors.password =
        "Password must be at least 8 characters with uppercase, lowercase, number, and special character";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors((prev) => ({ ...prev, general: "" }));

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push("/verify-account");
      } else {
        setErrors((prev) => ({
          ...prev,
          general: data.message || "Signup failed. Please try again.",
        }));
      }
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        general: "An unexpected error occurred. Please try again.",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setErrors((prev) => ({ ...prev, general: "" }));
    await signInWithGoogle();
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900"
      style={{
        perspective: "1000px",
      }}
    >
      {/* Dynamic Background Layers */}
      <div className="absolute inset-0">
        {/* Layer 1: Morphing Geometric Shapes */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl transition-all duration-1000"
            style={{
              background: `conic-gradient(from ${
                formProgress * 3.6
              }deg, #10b981, #8b5cf6, #06b6d4, #10b981)`,
              transform: `scale(${1 + formProgress / 200}) rotate(${
                formProgress * 2
              }deg)`,
            }}
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl transition-all duration-1000"
            style={{
              background: `conic-gradient(from ${
                -formProgress * 2.4
              }deg, #8b5cf6, #06b6d4, #10b981, #8b5cf6)`,
              transform: `scale(${1 + formProgress / 300}) rotate(${
                -formProgress * 1.5
              }deg)`,
            }}
          />
        </div>

        {/* Layer 2: Interactive Particles */}
        {isMounted && (
          <div className="absolute inset-0">
            {particles.map((particle) => (
              <div
                key={particle.id}
                className={`absolute w-1 h-1 rounded-full transition-all duration-100`}
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  opacity: particle.opacity,
                  backgroundColor:
                    particle.color === "emerald"
                      ? "#10b981"
                      : particle.color === "purple"
                      ? "#8b5cf6"
                      : "#06b6d4",
                  transform: `scale(${particle.size})`,
                  boxShadow: `0 0 ${particle.size * 4}px currentColor`,
                }}
              />
            ))}
          </div>
        )}

        {/* Layer 3: Constellation Lines */}
        <svg
          className="absolute inset-0 w-full h-full opacity-20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id="constellation-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop
                offset="0%"
                stopColor="#10b981"
                stopOpacity={formProgress / 100}
              />
              <stop
                offset="50%"
                stopColor="#8b5cf6"
                stopOpacity={formProgress / 100}
              />
              <stop
                offset="100%"
                stopColor="#06b6d4"
                stopOpacity={formProgress / 100}
              />
            </linearGradient>
          </defs>
          <path
            d={`M${20 + formProgress}%,20% Q50%,${30 + formProgress / 4}% ${
              80 - formProgress / 2
            }%,40% T90%,60%`}
            stroke="url(#constellation-gradient)"
            strokeWidth="1"
            fill="none"
            className="animate-pulse"
          />
          <path
            d={`M10%,${80 - formProgress / 3}% Q${
              40 + formProgress / 2
            }%,70% 70%,${60 + formProgress / 4}% T95%,30%`}
            stroke="url(#constellation-gradient)"
            strokeWidth="1"
            fill="none"
            className="animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </svg>
      </div>

      {/* Floating UI Elements */}
      {isMounted &&
        floatingElements.map((element, index) => {
          const Icon = element.icon;
          const angle = element.angle + ((Date.now() / 5000) * 360) / 1000; // Slow rotation
          const x =
            50 +
            Math.cos((angle * Math.PI) / 180) *
              ((element.radius / window.innerWidth) * 50);
          const y =
            50 +
            Math.sin((angle * Math.PI) / 180) *
              ((element.radius / window.innerHeight) * 50);

          return (
            <div
              key={index}
              className="absolute hidden lg:block transition-all duration-300 pointer-events-none"
              style={{
                left: `${Math.max(5, Math.min(95, x))}%`,
                top: `${Math.max(5, Math.min(95, y))}%`,
                transform: "translate(-50%, -50%)",
                opacity: 0.6 + (formProgress / 100) * 0.4,
              }}
            >
              <div
                className={`flex items-center gap-3 px-4 py-2 rounded-full bg-gray-800/40 backdrop-blur-sm border border-${element.color}-500/30`}
              >
                <Icon className={`h-5 w-5 text-${element.color}-400`} />
                <span className="text-sm text-white/80 font-medium">
                  {element.label}
                </span>
              </div>
            </div>
          );
        })}

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {/* Back Link */}
          <Link
            href="/login"
            className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to login
          </Link>

          {/* 3D Floating Form Card */}
          <div
            className="relative"
            style={{
              transform: `
                rotateX(${mousePosition.y * 5}deg) 
                rotateY(${mousePosition.x * 5}deg)
                translateZ(20px)
              `,
              transformStyle: "preserve-3d",
              transition: "transform 0.1s ease-out",
            }}
          >
            {/* Card Glow Effect */}
            <div
              className="absolute -inset-4 rounded-3xl blur-xl transition-all duration-500"
              style={{
                background: `conic-gradient(from ${
                  formProgress * 3.6
                }deg, rgba(16, 185, 129, 0.3), rgba(139, 92, 246, 0.3), rgba(6, 182, 212, 0.3))`,
                opacity: 0.3 + (formProgress / 100) * 0.4,
              }}
            />

            <Card className="relative border-gray-700/50 shadow-2xl bg-gray-900/90 backdrop-blur-xl rounded-3xl overflow-hidden">
              {/* Progress Bar */}
              <div
                className="absolute top-0 left-0 h-1 bg-gradient-to-r from-emerald-500 via-purple-500 to-teal-500 transition-all duration-500"
                style={{ width: `${formProgress}%` }}
              />

              <CardHeader className="text-center space-y-4 pt-8">
                <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500/20 to-purple-500/20 flex items-center justify-center backdrop-blur-sm border border-emerald-500/30">
                  <User className="h-8 w-8 text-emerald-400" />
                </div>
                <div>
                  <CardTitle className="text-3xl font-bold text-white mb-2">
                    Join{" "}
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-500">
                      Goldman
                    </span>
                  </CardTitle>
                  <CardDescription className="text-gray-400 text-lg">
                    Create your quantum-secured account
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-6 p-8">
                {/* Google Signup Button */}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 bg-gray-800/50 border-gray-600 text-white hover:bg-gray-700/50 rounded-xl transition-all duration-300 hover:scale-105"
                  onClick={handleGoogleSignup}
                  disabled={isGoogleLoading}
                >
                  {isGoogleLoading ? (
                    <div className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : (
                    <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                  )}
                  {isGoogleLoading
                    ? "Connecting to Google..."
                    : "Continue with Google"}
                </Button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-600" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-gray-900 px-4 text-gray-400 font-medium">
                      Or create with email
                    </span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name and Email Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name Field */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="name"
                        className="text-gray-300 font-medium"
                      >
                        Full Name
                      </Label>
                      <div className="relative group">
                        <User className="absolute left-4 top-4 h-5 w-5 text-gray-500 group-focus-within:text-emerald-400 transition-colors" />
                        <Input
                          id="name"
                          type="text"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          className={`pl-12 h-12 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl transition-all duration-300 ${
                            errors.name
                              ? "border-red-500 focus:border-red-500"
                              : ""
                          }`}
                        />
                      </div>
                      {errors.name && (
                        <p className="text-sm text-red-400 flex items-center gap-2">
                          <XCircle className="h-4 w-4" />
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-gray-300 font-medium"
                      >
                        Email Address
                      </Label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-4 h-5 w-5 text-gray-500 group-focus-within:text-emerald-400 transition-colors" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          className={`pl-12 h-12 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl transition-all duration-300 ${
                            errors.email
                              ? "border-red-500 focus:border-red-500"
                              : ""
                          }`}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-sm text-red-400 flex items-center gap-2">
                          <XCircle className="h-4 w-4" />
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Password and Confirm Password Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Password Field */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="password"
                        className="text-gray-300 font-medium"
                      >
                        Password
                      </Label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-4 h-5 w-5 text-gray-500 group-focus-within:text-emerald-400 transition-colors" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create password"
                          value={formData.password}
                          onChange={(e) =>
                            handleInputChange("password", e.target.value)
                          }
                          className={`pl-12 pr-12 h-12 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl transition-all duration-300 ${
                            errors.password
                              ? "border-red-500 focus:border-red-500"
                              : ""
                          }`}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-2 h-8 w-8 p-0 hover:bg-gray-700/50 text-gray-500 hover:text-gray-300 rounded-lg"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      {formData.password && (
                        <div className="space-y-1 text-sm mt-2 px-1">
                          <div className="flex items-center gap-2">
                            {formData.password.length >= 8 ? (
                              <CheckCircle className="h-4 w-4 text-emerald-400" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-400" />
                            )}
                            <span
                              className={
                                formData.password.length >= 8
                                  ? "text-emerald-400"
                                  : "text-gray-400"
                              }
                            >
                              At least 8 characters
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {/[A-Z]/.test(formData.password) ? (
                              <CheckCircle className="h-4 w-4 text-emerald-400" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-400" />
                            )}
                            <span
                              className={
                                /[A-Z]/.test(formData.password)
                                  ? "text-emerald-400"
                                  : "text-gray-400"
                              }
                            >
                              One uppercase letter
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {/[a-z]/.test(formData.password) ? (
                              <CheckCircle className="h-4 w-4 text-emerald-400" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-400" />
                            )}
                            <span
                              className={
                                /[a-z]/.test(formData.password)
                                  ? "text-emerald-400"
                                  : "text-gray-400"
                              }
                            >
                              One lowercase letter
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {/\d/.test(formData.password) ? (
                              <CheckCircle className="h-4 w-4 text-emerald-400" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-400" />
                            )}
                            <span
                              className={
                                /\d/.test(formData.password)
                                  ? "text-emerald-400"
                                  : "text-gray-400"
                              }
                            >
                              One number
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {/[@$!%*?&]/.test(formData.password) ? (
                              <CheckCircle className="h-4 w-4 text-emerald-400" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-400" />
                            )}
                            <span
                              className={
                                /[@$!%*?&]/.test(formData.password)
                                  ? "text-emerald-400"
                                  : "text-gray-400"
                              }
                            >
                              One special character
                            </span>
                          </div>
                        </div>
                      )}

                      {errors.password && (
                        <p className="text-sm text-red-400">
                          {errors.password}
                        </p>
                      )}
                    </div>

                    {/* Confirm Password Field */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="confirmPassword"
                        className="text-gray-300 font-medium"
                      >
                        Confirm Password
                      </Label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-4 h-5 w-5 text-gray-500 group-focus-within:text-emerald-400 transition-colors" />
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm password"
                          value={formData.confirmPassword}
                          onChange={(e) =>
                            handleInputChange("confirmPassword", e.target.value)
                          }
                          className={`pl-12 pr-12 h-12 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl transition-all duration-300 ${
                            errors.confirmPassword
                              ? "border-red-500 focus:border-red-500"
                              : ""
                          }`}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-2 h-8 w-8 p-0 hover:bg-gray-700/50 text-gray-500 hover:text-gray-300 rounded-lg"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      {formData.confirmPassword && (
                        <div className="flex items-center gap-2 text-sm">
                          {isConfirmPasswordValid ? (
                            <CheckCircle className="h-4 w-4 text-emerald-400" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-400" />
                          )}
                          <span
                            className={
                              isConfirmPasswordValid
                                ? "text-emerald-400"
                                : "text-gray-400"
                            }
                          >
                            Passwords match
                          </span>
                        </div>
                      )}
                      {errors.confirmPassword && (
                        <p className="text-sm text-red-400">
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* General Error */}
                  {(errors.general || googleError) && (
                    <Alert className="border-red-500/20 bg-red-500/10 text-red-300 rounded-xl">
                      <XCircle className="h-4 w-4 text-red-400" />
                      <AlertDescription>
                        {errors.general || googleError}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25"
                    disabled={
                      isLoading || !isPasswordValid || !isConfirmPasswordValid
                    }
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Creating Account...
                      </div>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>

                {/* Login Link */}
                <p className="text-center text-gray-400">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-medium text-emerald-400 hover:text-emerald-300 hover:underline transition-colors"
                  >
                    Sign in
                  </Link>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
