import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});
export type LoginValues = z.infer<typeof LoginSchema>;

const usernameField = z
  .string()
  .min(3, "At least 3 characters")
  .max(20, "At most 20 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Letters, numbers, underscores only");

export const SignupSchema = z.object({
  username: usernameField,
  email: z.string().email("Enter a valid email"),
  password: z
    .string()
    .min(8, "At least 8 characters")
    .regex(/[0-9]/, "Must contain at least one number"),
});
export type SignupValues = z.infer<typeof SignupSchema>;

// avatarUrl excluded — handled by a separate upload component
export const ProfileFormSchema = z.object({
  username: usernameField,
});
export type ProfileFormValues = z.infer<typeof ProfileFormSchema>;
