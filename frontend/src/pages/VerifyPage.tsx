import { VerifyForm } from "@/features/auth/components/VerifyForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const VerifyPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Check your Email</CardTitle>
          <CardDescription>We've sent a verification code.</CardDescription>
        </CardHeader>
        <CardContent>
          <VerifyForm />
        </CardContent>
      </Card>
    </div>
  );
};