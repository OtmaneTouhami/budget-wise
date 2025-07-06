import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  useVerifyAccount,
  useResendVerification,
} from "@/api/generated/hooks/authentication/authentication";
import { useAuthStore } from "@/store/auth-store";
import { useGetUserProfile } from "@/api/generated/hooks/user-profile/user-profile";
import type { ApiErrorResponse } from "@/types/error";

const verifySchema = z.object({
  token: z.string().min(6, { message: "Token must be 6 characters." }),
});
type VerifySchema = z.infer<typeof verifySchema>;

export const VerifyForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const identifier = location.state?.identifier;

  const authStoreLogin = useAuthStore((state) => state.login);
  const verifyMutation = useVerifyAccount();
  const resendMutation = useResendVerification();

  const [resendCooldown, setResendCooldown] = React.useState(0);

  // Disable this hook from running automatically; we will trigger it manually.
  const { refetch: fetchProfile } = useGetUserProfile({
    query: { enabled: false },
  });

  const form = useForm<VerifySchema>({
    resolver: zodResolver(verifySchema),
    defaultValues: { token: "" },
  });

  if (!identifier) {
    return (
      <div className="text-center text-destructive">
        <p>Something went wrong. We don't know who to verify.</p>
        <p>Please try registering again.</p>
      </div>
    );
  }

  const onSubmit = async (values: VerifySchema) => {
    try {
      // 1. Call the verification endpoint
      const tokens = await verifyMutation.mutateAsync({
        data: { token: values.token, identifier },
      });

      toast.success("Account verified successfully! Logging you in...");

      // -- FIX for Success Bug --
      // 2. IMMEDIATELY set the tokens in the store. This ensures the next API call is authenticated.
      useAuthStore.setState({
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        isAuth: true,
      });

      // 3. Now that the token is set, fetch the full user profile.
      const { data: userProfile } = await fetchProfile();
      if (!userProfile)
        throw new Error("Could not fetch user profile after verification.");

      // 4. Update the store with the full user object.
      if (tokens.access_token && tokens.refresh_token) {
        authStoreLogin(
          {
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
          },
          userProfile
        );
      }

      // 5. Navigate to the dashboard
      navigate("/dashboard");
    } catch (error) {
      // -- FIX for Failure Bug --
      const apiError = error as { data: ApiErrorResponse };
      toast.error(
        apiError.data?.message || "Verification failed. Please try again."
      );
      // Reset the form field to allow for a new attempt.
      form.setValue("token", "");
    }
  };

  const handleResend = async () => {
    try {
      await resendMutation.mutateAsync({ data: { identifier } });
      toast.success("A new verification code has been sent to your email.");
      setResendCooldown(60); // Start 60-second cooldown
      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      toast.error("Failed to resend code.");
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle>Verify Your Account</CardTitle>
        <CardDescription>
          Please enter the 6-digit code sent to{" "}
          <span className="font-medium text-foreground">{identifier}</span>.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="token"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputOTP
                      maxLength={6}
                      {...field}
                      containerClassName="justify-center"
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={verifyMutation.isPending}
              className="w-full"
            >
              {verifyMutation.isPending ? "Verifying..." : "Verify Account"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={handleResend}
              disabled={resendMutation.isPending || resendCooldown > 0}
              className="w-full"
            >
              {resendCooldown > 0
                ? `Resend in ${resendCooldown}s`
                : "Resend Code"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
