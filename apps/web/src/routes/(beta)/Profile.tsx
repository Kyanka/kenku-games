import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../../lib/auth-client.js";
import { useProfile } from "../../hooks/useProfile.js";
import { ProfileFormSchema, type ProfileFormValues } from "../../lib/schemas.js";

export function Profile() {
  const navigate = useNavigate();
  const { data: session } = useSession();
  const { profile, isLoading, updateProfile } = useProfile();

  const displayUsername = profile?.username ?? "";

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(ProfileFormSchema),
    defaultValues: { username: displayUsername },
  });

  // Populate the form once Zero delivers the profile snapshot.
  useEffect(() => {
    if (profile?.username) reset({ username: profile.username });
  }, [profile?.username, reset]);

  async function onSubmit(values: ProfileFormValues) {
    try {
      await updateProfile({ username: values.username });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Update failed";
      if (msg.toLowerCase().includes("unique") || msg.toLowerCase().includes("username")) {
        setError("username", { message: "Username is already taken" });
      } else {
        setError("root", { message: msg });
      }
    }
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-8">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/")}
          className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold">Profile</h1>
      </div>

      {session?.user && (
        <div className="flex flex-col gap-0.5">
          {isLoading ? (
            <p className="text-sm text-slate-400 animate-pulse">Loading profile…</p>
          ) : displayUsername ? (
            <p className="text-base font-medium text-slate-900">@{displayUsername}</p>
          ) : null}
          <div className="flex items-center gap-2">
            <p className="text-sm text-slate-500">{session.user.email}</p>
            {profile?.isAdmin && (
              <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                Admin
              </span>
            )}
          </div>
        </div>
      )}

      {/* TODO: avatar upload component */}
      {profile?.avatarUrl && (
        <img
          src={profile.avatarUrl}
          alt="Avatar"
          className="h-20 w-20 rounded-full object-cover border border-slate-200"
        />
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-700">Username</label>
          <input
            {...register("username")}
            disabled={isLoading}
            className="rounded border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:bg-slate-50 disabled:text-slate-400"
          />
          {errors.username && <p className="text-xs text-red-500">{errors.username.message}</p>}
        </div>

        {errors.root && <p className="text-sm text-red-500">{errors.root.message}</p>}
        {isSubmitSuccessful && !errors.root && (
          <p className="text-sm text-green-600">Profile updated!</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="rounded bg-slate-800 px-4 py-2 text-sm font-medium text-fg hover:bg-slate-700 disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save changes"}
        </button>
      </form>
    </main>
  );
}
