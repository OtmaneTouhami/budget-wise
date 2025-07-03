import { RegisterForm } from "@/features/auth/components/RegisterForm";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export const RegisterPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 py-12">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Create your BudgetWise Account</CardTitle>
          <CardDescription>
            Join us! Fill out the form below to get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>
    </div>
  );
};
