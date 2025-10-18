import { useState, useEffect } from "react";
import { User, Lock, Trash2, Eye, EyeOff } from "lucide-react";
import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { useGetMyAccount } from "../hooks/use-get-my-account";
import { useUpdatePassword } from "../hooks/use-update-password";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const passwordSchema = z
  .object({
    oldPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

export default function AccountSettingsPage() {
  const { data: myAccount, isLoading } = useGetMyAccount();
  const {
    mutate: updatePassword,
    isPending: isUpdatingPassword,
    isSuccess,
  } = useUpdatePassword();

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  // Reset form after successful password update
  useEffect(() => {
    if (isSuccess) {
      reset();
      setShowOldPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    }
  }, [isSuccess, reset]);

  const onPasswordSubmit = (data: PasswordFormData) => {
    updatePassword({
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
      newPasswordAgain: data.confirmPassword,
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-gray-500">Loading account information...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 p-6 text-white shadow-lg">
        <div className="absolute right-0 top-0 h-32 w-32 translate-x-16 -translate-y-16 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute bottom-0 left-0 h-32 w-32 -translate-x-16 translate-y-16 rounded-full bg-white/10 blur-2xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-white/20 p-2 backdrop-blur-sm">
              <User size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Account Settings</h1>
              <p className="text-sm text-blue-100">
                Manage your account information and security
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Account Information */}
        <Card className="border-gray-300 shadow-md">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <User size={20} className="text-blue-600" />
              <h2 className="text-lg font-bold text-gray-900">
                Account Information
              </h2>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={myAccount?.email || ""}
                  disabled
                  className="mt-1 bg-gray-50"
                />
              </div>
              <div>
                <Label htmlFor="firstName" className="text-sm font-medium">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  value={myAccount?.accountParameters?.firstName || ""}
                  disabled
                  className="mt-1 bg-gray-50"
                  placeholder="Not set"
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-sm font-medium">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  value={myAccount?.accountParameters?.lastName || ""}
                  disabled
                  className="mt-1 bg-gray-50"
                  placeholder="Not set"
                />
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-blue-50 p-3">
                <div
                  className={`h-2 w-2 rounded-full ${
                    myAccount?.isActive ? "bg-green-500" : "bg-gray-400"
                  }`}
                />
                <span className="text-sm font-medium text-gray-700">
                  Status: {myAccount?.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card className="border-gray-300 shadow-md">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <Lock size={20} className="text-blue-600" />
              <h2 className="text-lg font-bold text-gray-900">
                Change Password
              </h2>
            </div>
            <form
              onSubmit={handleSubmit(onPasswordSubmit)}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="oldPassword" className="text-sm font-medium">
                  Current Password
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="oldPassword"
                    type={showOldPassword ? "text" : "password"}
                    {...register("oldPassword")}
                    className="pr-10"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.oldPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.oldPassword.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="newPassword" className="text-sm font-medium">
                  New Password
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    {...register("newPassword")}
                    className="pr-10"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>
              <div>
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium"
                >
                  Confirm New Password
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    {...register("confirmPassword")}
                    className="pr-10"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                disabled={isUpdatingPassword}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isUpdatingPassword ? "Updating..." : "Update Password"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Danger Zone */}
      <Card className="border-red-300 shadow-md">
        <CardContent className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <Trash2 size={20} className="text-red-600" />
            <h2 className="text-lg font-bold text-gray-900">Danger Zone</h2>
          </div>
          <div className="rounded-lg bg-red-50 p-4">
            <p className="mb-3 text-sm text-red-900">
              <strong>Delete Account:</strong> Once you delete your account,
              there is no going back. All your workspaces, credential groups,
              and credentials will be permanently deleted.
            </p>
            <Button
              variant="destructive"
              className="bg-red-600 hover:bg-red-700"
              disabled
            >
              <Trash2 size={16} className="mr-2" />
              Delete Account (Coming Soon)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
