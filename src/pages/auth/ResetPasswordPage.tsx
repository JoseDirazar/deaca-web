import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useAuth } from "../../hooks/useAuth.hook";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword.mutateAsync({
        email,
        resetCode,
        newPassword,
      });
      toast.success("Password reset successful!");
      navigate("/auth/sign-in", { state: { passwordReset: true } });
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(
          error?.response?.data?.message || "Failed to reset password"
        );
      } else {
        toast.error("An unexpected error occurred");
      }
      console.error("Password reset error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex w-full flex-col justify-center p-8 lg:w-1/2">
        <div className="mx-auto w-full max-w-md">
          <Link to="/" className="mb-4 inline-block">
            <img src="/logo.webp" alt="Pawlinkd" className="h-10" />
          </Link>

          <h1 className="mb-6 text-3xl font-semibold text-gray-800">
            Reset your password
          </h1>

          <p className="mb-8 text-gray-600">
            Please enter your new password below.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Your email address"
                className="w-full py-5"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label
                htmlFor="resetCode"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Reset Code
              </label>
              <input
                id="resetCode"
                type="text"
                placeholder="Code from your email"
                className="w-full py-5"
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
                  className="w-full py-5 pr-16"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-sm text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm New Password"
                  className="w-full py-5 pr-16"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <button
              type="submit"
              className="hover:bg-primary-600 w-full bg-primary py-6 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>

            <div className="text-center text-sm text-gray-600">
              Remember your password?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Log in here
              </Link>
              .
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
