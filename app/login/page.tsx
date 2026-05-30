import { Suspense } from "react";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full overflow-hidden">
      <Suspense fallback={<div className="h-screen w-full" />}>
        <LoginForm className="h-screen w-full" />
      </Suspense>
    </div>
  )
}