import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../lib/auth-client.js";
import { useProfile } from "../hooks/useProfile.js";
import { ProfileFormSchema, type ProfileFormValues } from "../lib/schemas.js";
import { Sidebar } from "../components/Sidebar.js";

export function ProfilePage() {
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
    <main className="text-grey flex font-main justify-between gap-5">
      <div className="border-r border-white w-1/4">
        <Sidebar />
      </div>

      <div className="w-3/4">
        <div>
          <button onClick={() => navigate("/")} className="hover: text-green">
            Home
          </button>
          <h1 className="text-2xl font-bold">Profile</h1>
        </div>

        {session?.user && (
          <div>
            {isLoading ? (
              <p>Loading profile...</p>
            ) : displayUsername ? (
              <p>@{displayUsername}</p>
            ) : null}
            <div>
              <p>{session.user.email}</p>
            </div>
            {profile?.isAdmin && <span>Admin</span>}
          </div>
        )}

        <form action="">
          <div>
            <label htmlFor=""></label>
            <input type="text" />

            {errors.username && <p>errors.username.message</p>}
          </div>
          {errors.root && <p></p>}
          {isSubmitSuccessful && !errors.root && <p></p>}

          <button></button>
        </form>
      </div>
    </main>
  );
}
