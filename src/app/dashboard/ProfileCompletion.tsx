"use client";
import { useState } from "react";
import { z } from "zod";
import { Button } from "@/frontend/components/ui/Button";
import { Input } from "@/frontend/components/ui/Input";
import { useAuth } from "@/contexts/SupabaseAuthContext";

const ProfileSchema = z.object({
  display_name: z.string().min(1, "Display name is required"),
  business_name: z.string().min(1, "Business name is required"),
});

export default function ProfileCompletion({ initialDisplayName, initialBusinessName, onComplete }: {
  initialDisplayName?: string;
  initialBusinessName?: string;
  onComplete?: () => void;
}) {
  const { updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    display_name: initialDisplayName || "",
    business_name: initialBusinessName || "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccess(null);
    const result = ProfileSchema.safeParse(formData);
    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) errs[err.path[0] as string] = err.message;
      });
      setErrors(errs);
      return;
    }
    setIsLoading(true);
    try {
      await updateProfile(formData);
      setSuccess("Profile updated!");
      if (onComplete) onComplete();
    } catch (err: any) {
      setErrors({ form: err?.message || "Failed to update profile." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border border-yellow-300 bg-yellow-50 rounded-md mb-8">
      <div className="font-semibold text-yellow-800">Complete your profile to unlock all dashboard features</div>
      {errors.form && <div className="text-red-600 text-sm">{errors.form}</div>}
      {success && <div className="text-green-600 text-sm">{success}</div>}
      <Input
        label="Display Name"
        id="display_name"
        name="display_name"
        value={formData.display_name}
        onChange={handleChange}
        error={errors.display_name}
        required
      />
      <Input
        label="Business Name"
        id="business_name"
        name="business_name"
        value={formData.business_name}
        onChange={handleChange}
        error={errors.business_name}
        required
      />
      <Button type="submit" loading={isLoading} disabled={isLoading} className="w-full">
        Save Profile
      </Button>
    </form>
  );
}
