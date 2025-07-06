import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { registerBody } from "@/api/generated/zod/authentication/authentication";
import { useRegister } from "@/api/generated/hooks/authentication/authentication";
import type { ApiErrorResponse } from "@/types/error";
import { CountryPhoneInput } from "./CountryPhoneInput";

const registerSchema = registerBody
  .extend({
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterSchema = z.infer<typeof registerSchema>;

export const RegisterForm = () => {
  const navigate = useNavigate();
  const registerMutation = useRegister();

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      countryId: undefined,
    },
  });

  const onSubmit = async (values: RegisterSchema) => {
    try {
      await registerMutation.mutateAsync({ data: values });
      toast.success(
        "Registration successful! Please check your email for a verification code."
      );
      navigate("/verify", { state: { identifier: values.email } });
    } catch (error) {
      const apiError = error as { data: ApiErrorResponse };
      toast.error(
        apiError.data?.message || "An error occurred during registration."
      );
      console.error("Registration failed:", apiError.data);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="johndoe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <CountryPhoneInput
                  countryId={form.watch("countryId")}
                  onCountryChange={(id) => {
                    if (id !== undefined) {
                      form.setValue("countryId", id);
                    }
                  }}
                  phoneNumber={field.value}
                  onPhoneNumberChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="countryId"
          render={() => (
            <FormItem className="hidden">
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-4 pt-4">
          <Button
            type="submit"
            disabled={registerMutation.isPending}
            className="w-full"
          >
            {registerMutation.isPending
              ? "Creating Account..."
              : "Create Account"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="underline hover:text-primary">
              Login here
            </Link>
          </p>
        </div>
      </form>
    </Form>
  );
};
