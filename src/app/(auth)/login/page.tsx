import { AuthForm } from "@/features/auth/AuthForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#111,transparent)]" />
      <AuthForm type="login" />
    </div>
  );
}
