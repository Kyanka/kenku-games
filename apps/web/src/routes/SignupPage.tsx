import logo from "../images/logo.svg";
import { Github } from "../icons/Github";
import { Discord } from "../icons/Discord";
import { Google } from "../icons/Google";
import { useNavigate, Link } from "react-router-dom";
import { signUp, useSession } from "../lib/auth-client.js";
import { useEffect } from "react";
import { SignupSchema, type SignupValues } from "../lib/schemas.js";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

async function checkUsernameAvailable(username: string): Promise<boolean> {
  const res = await fetch(
    `${API_BASE}/api/check-username?username=${encodeURIComponent(username)}`,
  );
  if (!res.ok) return false;
  const data = await res.json();
  return data.available === true;
}

export function SignupPage() {
  const navigate = useNavigate();
  const { data: session } = useSession();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignupValues>({
    resolver: zodResolver(SignupSchema),
  });

  useEffect(() => {
    if (session) navigate("/", { replace: true });
  }, [session, navigate]);

  async function onSubmit(values: SignupValues) {
    // Check username availability before creating account
    const available = await checkUsernameAvailable(values.username);
    if (!available) {
      setError("username", { message: "This username is already taken" });
      return;
    }

    // Pass username as `name` — auth.ts databaseHooks picks it up to create the profile row
    const { error } = await signUp.email({
      name: values.username,
      email: values.email,
      password: values.password,
    });
    if (error) {
      setError("root", { message: error.message ?? "Sign up failed" });
    }
  }

  return (
    <main className="mx-auto flex flex-col p-2 bg-black font-second">
      <header className="mx-auto w-110 flex-col pb-5">
        <img src={logo} alt="logo" />
      </header>

      <div className="mx-auto max-w-md">
        <div className="mb-4">
          <h1 className="uppercase text-green font-main text-lg "> &gt; User authentication</h1>
          <p className="text-sm text-grey">Access your global save progress and arcade rank.</p>
        </div>

        <form className="gap-2 flex-col flex" onSubmit={handleSubmit(onSubmit)}>
          <label className="uppercase text-grey font-main text-sm" htmlFor="username">
            &gt; Username:{" "}
          </label>
          <input
            className={`block w-full border border-grey py-2 placeholder:uppercase text-grey
            ${errors.username ? "border-pink" : "border-grey "}`}
            placeholder="&gt; pixel_ "
            id="username"
            type="text"
            autoComplete="username"
            {...register("username")}
          />
          {errors.username ? (
            <p className="text-xs text-pink">{errors.username.message}</p>
          ) : (
            <p className="text-xs text-grey">3–20 characters, letters, numbers, underscores</p>
          )}
          <label className="uppercase text-grey font-main text-sm " htmlFor="email">
            &gt; Email:
          </label>
          <input
            className="block w-full border border-grey py-2 placeholder:uppercase text-grey "
            placeholder="&gt; enter email"
            id="email"
            type="email"
            autoComplete="email"
            {...register("email")}
          />
          {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
          <label className="uppercase text-grey font-main text-sm " htmlFor="password">
            &gt; Password:
          </label>
          <input
            className="block w-full border border-grey py-2 placeholder:uppercase text-grey "
            placeholder="&gt; enter secure pass"
            id="password"
            type="password"
            autoComplete="new-password"
            {...register("password")}
          />
          {errors.password ? (
            <p className="text-xs text-pink">{errors.password.message}</p>
          ) : (
            <p className="text-xs text-grey">Min 8 characters, at least one number</p>
          )}

          <label className="uppercase text-grey font-main text-sm" htmlFor="confirm-password">
            &gt; Repeat password:
          </label>
          <input
            className="block w-full border border-grey py-2 placeholder:uppercase text-grey"
            placeholder="> enter secure pass"
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-xs text-pink">{errors.confirmPassword.message}</p>
          )}
          <p className="uppercase text-violet font-main mt-4 text-xs">or connect with</p>
          <div className="flex justify-between w-full gap-2">
            <button className="gap-2 items-center justify-center border px-4 py-2 inline-flex text-blue border-grey ">
              <Discord /> <span className="text-white">discord</span>
            </button>

            <button className="gap-2 items-center justify-center border  px-4 py-2 inline-flex border-grey text-white">
              <Github />
              <span className="text-white">github</span>
            </button>

            <button className=" gap-2 items-center justify-center border  px-4 py-2 inline-flex text-green border-grey ">
              <Google />
              <span className="text-white">google</span>
            </button>
          </div>
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className=" justify-center uppercase mx-auto flex w-full  py-2 bg-green mt-5 text-center font-main"
            >
              {isSubmitting ? "Creating account..." : "Sign up"}
            </button>
          </div>
        </form>

        <div className="flex gap-5 text-sm">
          <p className="text-pink">Privacy policy</p>
          <p className="text-violet uppercase">
            {" "}
            Already have an account?
            <Link to="/login"> Log in &gt;</Link>{" "}
          </p>
        </div>
      </div>
    </main>
  );
}
