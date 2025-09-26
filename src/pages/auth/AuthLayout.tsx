import AuthOutletContainer from "@/component/ui/auth/AuthOutletContainer";

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen">
      <div className="flex w-full flex-col items-center justify-center bg-white lg:w-1/2">
        <AuthOutletContainer />
      </div>
      <div className="relative hidden overflow-hidden bg-secondary lg:flex lg:w-1/2">
        <div className="absolute inset-0 bg-[url('/fondos/bg-blob.svg')] bg-cover bg-no-repeat fill-primary"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="">
            <img
              src="/fondos/arroyo.jpg"
              alt="arroyo"
              className="h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
