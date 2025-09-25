import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useAuth } from "../../hooks/useAuth.hook";

export default function EmailVerificationCodePage() {
  const [email, setEmail] = useState<string>("");
  const [emailCode, setEmailCode] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const { confirmEmail, resendVerificationEmail } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Try to get email from localStorage (for signup flow)
    const storedEmail = localStorage.getItem("pending_email");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !emailCode) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsVerifying(true);
    try {
      await confirmEmail.mutateAsync({ email, emailCode });
      toast.success("Email verified successfully!");
      navigate("/sign-in");
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data?.message || "Failed to verify email");
      } else {
        toast.error("An unexpected error occurred");
      }
      console.error("Email verification error:", error);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.error("Email address not found");
      return;
    }

    setIsResending(true);
    try {
      await resendVerificationEmail.mutateAsync(email);
      toast.success("Verification email resent");
    } catch (error) {
      console.error("Resend email error:", error);
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data?.message || "Failed to resend email");
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - Content */}
      <div className="flex w-full flex-col justify-center p-8 lg:w-1/2">
        <div className="mx-auto w-full max-w-md">
          <Link to="/" className="mb-4 inline-block">
            <img src="/logo.webp" alt="Pawlinkd" className="h-10" />
          </Link>

          <div className="mb-8 text-center">
            <h1 className="mb-4 text-2xl font-semibold text-gray-800">
              Verify your email address
            </h1>

            <p className="mb-6 text-gray-600">
              We've sent a verification code to{" "}
              <strong>{email || "your email"}</strong>. Please enter the code
              below to verify your account.
            </p>

            <form onSubmit={handleVerify} className="space-y-6">
              {!email && (
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1 block text-left text-sm font-medium text-gray-700"
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
                    disabled={isVerifying}
                  />
                </div>
              )}

              <div>
                <label
                  htmlFor="verificationCode"
                  className="mb-1 block text-left text-sm font-medium text-gray-700"
                >
                  Verification Code
                </label>
                <input
                  id="verificationCode"
                  type="text"
                  placeholder="Enter verification code"
                  className="w-full py-5"
                  value={emailCode}
                  onChange={(e) => setEmailCode(e.target.value)}
                  required
                  disabled={isVerifying}
                />
              </div>

              <button
                type="submit"
                className="hover:bg-primary-600 w-full bg-primary py-6 text-white"
                disabled={isVerifying}
              >
                {isVerifying ? "Verifying..." : "Verify Email"}
              </button>
            </form>
          </div>

          <div className="border-t border-gray-200 pt-6 text-center">
            <p className="mb-4 text-gray-600">
              Didn't receive a verification code?
            </p>
            <button
              onClick={handleResend}
              className="mx-auto"
              disabled={isResending}
            >
              {isResending ? "Sending..." : "Click here to resend"}
            </button>
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/login"
              className="inline-flex items-center text-gray-600"
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
              Back to Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
