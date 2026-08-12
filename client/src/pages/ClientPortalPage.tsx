import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "sonner";
import {
  forgotPassword,
  login,
  resetPassword,
  verifyResetToken,
} from "../lib/api";

type AuthStep = "sign-in" | "forgot" | "verify-token" | "new-password";

interface SignInFormData {
  email: string;
  password: string;
}

interface ForgotFormData {
  email: string;
}

interface TokenFormData {
  token: string;
}

interface NewPasswordFormData {
  password: string;
  confirmPassword: string;
}

// Thin threads converge from a wide spread at the top into a tight cluster
// behind the login card, then fan back out toward the bottom — the same
// "converging strands" silhouette as https://dev.mbidm.com/, oriented
// vertically. Motion comes from animating each thread's dash pattern along
// its own path (not from moving the shape itself), so the funnel stays put
// while light appears to flow down every strand.
const VIEW_W = 600;
const VIEW_H = 1000;
const WAIST_Y = VIEW_H * 0.5;

interface ThreadConfig {
  topX: number;
  bottomX: number;
  waistX: number;
  strokeWidth: number;
  opacity: number;
  dashSum: 18 | 24 | 30;
  duration: number;
  delay: number;
}

const THREAD_COUNT = 26;

const THREADS: ThreadConfig[] = Array.from({ length: THREAD_COUNT }, (_, i) => {
  const t = i / (THREAD_COUNT - 1);
  const topX = -60 + t * (VIEW_W + 120) + Math.sin(i * 1.7) * 14;
  const bottomX = -40 + t * (VIEW_W + 80) + Math.cos(i * 1.3) * 18;
  const waistX = VIEW_W / 2 + Math.sin(i * 0.85) * 26;
  const dashSums: Array<18 | 24 | 30> = [18, 24, 30];

  return {
    topX,
    bottomX,
    waistX,
    strokeWidth: 0.6 + Math.abs(Math.sin(i * 2.3)) * 0.9,
    opacity: 0.35 + Math.abs(Math.cos(i * 1.1)) * 0.45,
    dashSum: dashSums[i % dashSums.length],
    duration: 7 + (i % 6) * 1.4,
    delay: -(i % 9) * 1.1,
  };
});

function buildFunnelPath({ topX, bottomX, waistX }: ThreadConfig) {
  const topY = -40;
  const bottomY = VIEW_H + 40;

  const c1y = topY + (WAIST_Y - topY) * 0.55;
  const c2y = topY + (WAIST_Y - topY) * 0.9;
  const c3y = WAIST_Y + (bottomY - WAIST_Y) * 0.1;
  const c4y = WAIST_Y + (bottomY - WAIST_Y) * 0.45;

  return `M${topX.toFixed(1)},${topY}
    C${topX.toFixed(1)},${c1y.toFixed(1)} ${waistX.toFixed(1)},${c2y.toFixed(1)} ${waistX.toFixed(1)},${WAIST_Y}
    C${waistX.toFixed(1)},${c3y.toFixed(1)} ${bottomX.toFixed(1)},${c4y.toFixed(1)} ${bottomX.toFixed(1)},${bottomY}`;
}

function FlowingRibbon() {
  return (
    <div className="portal-ribbon" aria-hidden="true">
      <svg
        className="portal-threads"
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="portal-thread-color" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={VIEW_H}>
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0" />
            <stop offset="15%" stopColor="#38bdf8" stopOpacity="0.55" />
            <stop offset="42%" stopColor="#0ea5e9" stopOpacity="0.95" />
            <stop offset="58%" stopColor="#14b8a6" stopOpacity="0.95" />
            <stop offset="85%" stopColor="#10b981" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
        </defs>
        {THREADS.map((thread, i) => (
          <path
            key={i}
            className="portal-thread"
            d={buildFunnelPath(thread)}
            fill="none"
            stroke="url(#portal-thread-color)"
            strokeWidth={thread.strokeWidth}
            strokeLinecap="round"
            opacity={thread.opacity}
            style={{
              strokeDasharray: `${thread.dashSum * 0.3} ${thread.dashSum * 0.7}`,
              animationDuration: `${thread.duration}s`,
              animationDelay: `${thread.delay}s`,
            }}
          />
        ))}
      </svg>
    </div>
  );
}

export function ClientPortalPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<AuthStep>("sign-in");
  const [isLoading, setIsLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetToken, setResetToken] = useState("");

  const signInForm = useForm<SignInFormData>({
    mode: "onSubmit",
    shouldFocusError: true,
    defaultValues: { email: "", password: "" },
  });

  const forgotForm = useForm<ForgotFormData>({
    mode: "onSubmit",
    defaultValues: { email: "" },
  });

  const tokenForm = useForm<TokenFormData>({
    mode: "onSubmit",
    defaultValues: { token: "" },
  });

  const passwordForm = useForm<NewPasswordFormData>({
    mode: "onSubmit",
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSignIn = async (data: SignInFormData) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      toast.success("Signed in successfully");
      navigate("/dashboard");
    } catch (error) {
      console.error("Sign in error:", error);
      toast.error(error instanceof Error ? error.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const onForgot = async (data: ForgotFormData) => {
    setIsLoading(true);
    try {
      const result = await forgotPassword(data.email);
      setResetEmail(data.email);
      toast.success(result.message || "If an account exists, a reset code has been sent.");
      setStep("verify-token");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to request reset");
    } finally {
      setIsLoading(false);
    }
  };

  const onVerifyToken = async (data: TokenFormData) => {
    setIsLoading(true);
    try {
      await verifyResetToken(resetEmail, data.token);
      setResetToken(data.token.trim().toUpperCase());
      toast.success("Code verified");
      setStep("new-password");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Invalid or expired code");
    } finally {
      setIsLoading(false);
    }
  };

  const onSetPassword = async (data: NewPasswordFormData) => {
    if (data.password !== data.confirmPassword) {
      passwordForm.setError("confirmPassword", {
        message: "Passwords do not match",
      });
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(resetEmail, resetToken, data.password);
      toast.success("Password updated. You can sign in now.");
      setStep("sign-in");
      signInForm.setValue("email", resetEmail);
      passwordForm.reset();
      tokenForm.reset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  const cardTitle =
    step === "sign-in"
      ? "Sign in to your account"
      : step === "forgot"
        ? "Reset your password"
        : step === "verify-token"
          ? "Enter your reset code"
          : "Choose a new password";

  return (
    <div className="portal-auth">
      <FlowingRibbon />

      <div className="portal-auth-content">
        <div className="portal-card">
          <h1 className="portal-card-title">{cardTitle}</h1>

          {step === "sign-in" && (
            <form onSubmit={signInForm.handleSubmit(onSignIn)} className="portal-form">
              <div className="portal-field">
                <Label htmlFor="email" className="portal-label">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className="portal-input"
                  {...signInForm.register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  aria-invalid={signInForm.formState.errors.email ? "true" : "false"}
                />
                {signInForm.formState.errors.email && (
                  <p className="portal-error">{signInForm.formState.errors.email.message}</p>
                )}
              </div>

              <div className="portal-field">
                <div className="portal-label-row">
                  <Label htmlFor="password" className="portal-label">
                    Password
                  </Label>
                  <button
                    type="button"
                    className="portal-link"
                    onClick={() => {
                      forgotForm.setValue("email", signInForm.getValues("email"));
                      setStep("forgot");
                    }}
                  >
                    Forgot your password?
                  </button>
                </div>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  className="portal-input"
                  {...signInForm.register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  aria-invalid={signInForm.formState.errors.password ? "true" : "false"}
                />
                {signInForm.formState.errors.password && (
                  <p className="portal-error">{signInForm.formState.errors.password.message}</p>
                )}
              </div>

              <Button type="submit" disabled={isLoading} className="portal-submit">
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          )}

          {step === "forgot" && (
            <form onSubmit={forgotForm.handleSubmit(onForgot)} className="portal-form">
              <p className="portal-help">
                Enter your account email and we&apos;ll send you a reset code.
              </p>
              <div className="portal-field">
                <Label htmlFor="forgot-email" className="portal-label">
                  Email
                </Label>
                <Input
                  id="forgot-email"
                  type="email"
                  autoComplete="email"
                  className="portal-input"
                  {...forgotForm.register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                />
                {forgotForm.formState.errors.email && (
                  <p className="portal-error">{forgotForm.formState.errors.email.message}</p>
                )}
              </div>
              <Button type="submit" disabled={isLoading} className="portal-submit">
                {isLoading ? "Sending..." : "Send reset code"}
              </Button>
              <button type="button" className="portal-link portal-link-center" onClick={() => setStep("sign-in")}>
                Back to sign in
              </button>
            </form>
          )}

          {step === "verify-token" && (
            <form onSubmit={tokenForm.handleSubmit(onVerifyToken)} className="portal-form">
              <p className="portal-help">
                We sent a reset code to <strong>{resetEmail}</strong>. Enter it below.
              </p>
              <div className="portal-field">
                <Label htmlFor="token" className="portal-label">
                  Reset code
                </Label>
                <Input
                  id="token"
                  type="text"
                  autoComplete="one-time-code"
                  className="portal-input portal-input-code"
                  {...tokenForm.register("token", {
                    required: "Reset code is required",
                    minLength: { value: 6, message: "Enter the full code from your email" },
                  })}
                />
                {tokenForm.formState.errors.token && (
                  <p className="portal-error">{tokenForm.formState.errors.token.message}</p>
                )}
              </div>
              <Button type="submit" disabled={isLoading} className="portal-submit">
                {isLoading ? "Verifying..." : "Continue"}
              </Button>
              <button type="button" className="portal-link portal-link-center" onClick={() => setStep("forgot")}>
                Resend code
              </button>
            </form>
          )}

          {step === "new-password" && (
            <form onSubmit={passwordForm.handleSubmit(onSetPassword)} className="portal-form">
              <p className="portal-help">
                Choose a new password for <strong>{resetEmail}</strong>.
              </p>
              <div className="portal-field">
                <Label htmlFor="new-password" className="portal-label">
                  New password
                </Label>
                <Input
                  id="new-password"
                  type="password"
                  autoComplete="new-password"
                  className="portal-input"
                  {...passwordForm.register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
                {passwordForm.formState.errors.password && (
                  <p className="portal-error">{passwordForm.formState.errors.password.message}</p>
                )}
              </div>
              <div className="portal-field">
                <Label htmlFor="confirm-password" className="portal-label">
                  Confirm password
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  className="portal-input"
                  {...passwordForm.register("confirmPassword", {
                    required: "Confirm your password",
                  })}
                />
                {passwordForm.formState.errors.confirmPassword && (
                  <p className="portal-error">
                    {passwordForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>
              <Button type="submit" disabled={isLoading} className="portal-submit">
                {isLoading ? "Updating..." : "Update password"}
              </Button>
            </form>
          )}
        </div>

        <p className="portal-footer">© nelan.dev</p>
      </div>
    </div>
  );
}
