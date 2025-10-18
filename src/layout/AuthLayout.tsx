import AuthOutletContainer from "@/component/auth/AuthOutletContainer";
import PageContainer from "@/component/ui/PageContainer";
import { publicBackground } from "@/lib/constants/public-backgrounds";

export default function AuthLayout() {
  return (
    <PageContainer className="relative flex-row">
      <div className="flex w-full flex-col items-center justify-center p-8 lg:w-1/2 lg:bg-gray-50">
        <AuthOutletContainer />
        <div className="absolute inset-0 z-0 overflow-hidden bg-secondary lg:hidden">
          <img
            src={
              publicBackground[
                Math.floor(Math.random() * (publicBackground.length - 1))
              ]
            }
            alt="arroyo"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
      <div className="z-0 hidden overflow-hidden bg-secondary lg:block lg:w-1/2">
        <img
          src={
            publicBackground[
              Math.floor(Math.random() * (publicBackground.length - 1))
            ]
          }
          alt="arroyo"
          className="h-full w-full object-cover"
        />
      </div>
    </PageContainer>
  );
}
