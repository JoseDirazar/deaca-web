import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useAuth } from "../../hooks/useAuth.hook";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { requestPasswordReset } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsLoading(true);
    try {
      await requestPasswordReset.mutateAsync({ email });
      setIsSubmitted(true);
      toast.success("Password reset link sent to your email");
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(
          error?.response?.data?.message || "Failed to request password reset"
        );
      } else {
        toast.error("An unexpected error occurred");
      }
      console.error("Password reset request error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - Form */}
      <div className="flex w-full flex-col justify-center p-8 lg:w-1/2">
        <div className="mx-auto w-full max-w-md">
          <Link to="/" className="mb-4 inline-block">
            <img src="/pawshake-logo.png" alt="Pawlinkd" className="h-10" />
          </Link>

          <Link
            to="/login"
            className="mb-8 inline-flex items-center text-gray-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            Go back
          </Link>

          <h1 className="mb-6 text-3xl font-semibold text-primary">
            Forgot your password?
          </h1>

          {!isSubmitted ? (
            <>
              <p className="mb-8 text-gray-600">
                Don't worry. Enter your e-mail address below and we'll send you
                a link to reset your password.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <input
                    id="email"
                    type="email"
                    placeholder="E-mail"
                    className="w-full py-5"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <button
                  type="submit"
                  className="hover:bg-primary-600 w-full bg-primary py-6 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Reset password"}
                </button>
              </form>
            </>
          ) : (
            <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-green-800">
              <h2 className="mb-2 text-lg font-semibold">Check your email</h2>
              <p>
                We've sent a password reset link to <strong>{email}</strong>.
                Please check your inbox and follow the instructions to reset
                your password.
              </p>
              <button
                onClick={() => navigate("/auth/reset-password")}
                className="mt-4"
              >
                Reset Password
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
