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
import { loginBody } from "@/api/generated/zod/authentication/authentication";
import { useLogin } from "@/api/generated/hooks/authentication/authentication";
import { useAuthStore } from "@/store/auth-store";
import { useGetUserProfile } from "@/api/generated/hooks/user-profile/user-profile";
import type { ApiErrorResponse } from "@/types/error";

// Create a Zod schema for the form, derived from the generated schema
const loginSchema = loginBody;
type LoginSchema = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const navigate = useNavigate();
  const authStoreLogin = useAuthStore((state) => state.login);
  const loginMutation = useLogin();

  // This hook will be used to fetch the user profile AFTER getting the tokens
  const { refetch: fetchProfile } = useGetUserProfile({
    query: { enabled: false }, // Disable this hook from running automatically
  });

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      loginIdentifier: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginSchema) => {
    try {
      // 1. Get tokens from the login endpoint
      const tokens = await loginMutation.mutateAsync({ data: values });
      toast.success("Login successful!");

      // Manually set tokens in the store so the next API call is authenticated
      useAuthStore.setState({ 
        accessToken: tokens.access_token, 
        refreshToken: tokens.refresh_token,
        isAuth: true
      });

      // 2. Fetch the full user profile
      const { data: userProfile } = await fetchProfile();
      if (!userProfile) throw new Error("Could not fetch user profile.");
      
      // 3. Store tokens and user profile together
      if(tokens.access_token && tokens.refresh_token){
        authStoreLogin(
          { accessToken: tokens.access_token, refreshToken: tokens.refresh_token },
          userProfile
        );
      }

      // 4. Navigate to the dashboard
      navigate("/dashboard");

    } catch (error) {
      const apiError = error as { data: ApiErrorResponse };
      toast.error(apiError.data?.message || "An error occurred during login.");
      console.error("Login failed:", apiError.data);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="loginIdentifier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username or Email</FormLabel>
              <FormControl>
                <Input placeholder="your_username or your@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
        <div className="flex flex-col gap-4">
            <Button type="submit" disabled={loginMutation.isPending} className="w-full">
            {loginMutation.isPending ? "Logging in..." : "Login"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/register" className="underline hover:text-primary">
                    Register here
                </Link>
            </p>
        </div>
      </form>
    </Form>
  );
};