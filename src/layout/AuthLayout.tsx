import AuthOutletContainer from "@/component/ui/auth/AuthOutletContainer";
import { publicBackground } from "@/lib/constants/public-backgrounds";

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen">
      <div className="flex w-full flex-col items-center justify-center bg-white lg:w-1/2">
        <AuthOutletContainer />
      </div>
      <div className="relative hidden overflow-hidden bg-secondary lg:flex lg:w-1/2">
        <div className="absolute inset-0 bg-[url('/fondos/bg-blob.svg')] bg-cover bg-no-repeat fill-primary"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={
              publicBackground[
                Math.floor(Math.random() * (publicBackground.length - 1))
              ]
            }
            alt="arroyo"
            className="h-screen object-cover"
          />
        </div>
      </div>
    </div>
  );
}
