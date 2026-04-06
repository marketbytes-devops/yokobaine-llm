import ResetPassword from "@/components/ui/loginpage/reset-password";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white"></div>}>
      <ResetPassword />
    </Suspense>
  );
}
