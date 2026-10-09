import { useEffect } from "react";
import logo from "../images/logo.svg";
import { Github } from "../icons/Github";
import { Discord } from "../icons/Discord";
import { Google } from "../icons/Google";
import { useNavigate, Link } from "react-router-dom";
import { signIn, useSession } from "../lib/auth-client.js";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, type LoginValues } from "../lib/schemas.js";

export function LoginPage() {
  const navigate = useNavigate();
  const { data: session } = useSession();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(LoginSchema),
  });

  useEffect(() => {
    if (session) navigate("/", { replace: true });
  }, [session, navigate]);

  async function onSubmit(values: LoginValues) {
    const { error } = await signIn.email({
      email: values.email,
      password: values.password,
    });
    if (error) {
      setError("root", { message: error.message ?? "Login failed" });
    }
  }

  return (
    <main className="flex flex-col items-center p-2 bg-surface">
      <header className="w-full sm:w-110 flex-col sm:pb-5">
        <img src={logo} alt="logo" />
      </header>

      <div className="w-full sm:max-w-md flex flex-col gap-2 p-2 sm:p-0">
        <div className="mb-4">
          <h3 className="uppercase text-accent font-main text-nowrap">&gt; User authentication</h3>
          <p className="font-second text-sm text-muted">
            Access your global save progress and arcade rank.
          </p>
        </div>

        <form className="gap-2 flex-col flex" onSubmit={handleSubmit(onSubmit)}>
          <label className="uppercase text-muted font-main" htmlFor="email">
            &gt; Email:{" "}
          </label>

          <input
            className="block w-full border border-line p-2 placeholder:uppercase text-muted font-second "
            placeholder="&gt; pixel_ "
            id="email"
            type="email"
            autoComplete="email"
            {...register("email")}
          />
          {errors.email && <p className="text-danger">{errors.email.message}</p>}
          <label className="uppercase text-muted font-main" htmlFor="password">
            &gt; Password:
          </label>

          <input
            className="font-second block w-full border border-line p-2 placeholder:uppercase text-muted "
            id="password"
            placeholder="&gt; enter secure pass"
            type="password"
            autoComplete="current-password"
            {...register("password")}
          />
          {errors.password && <span className="text-danger">{errors.password.message}</span>}
          <span className="uppercase text-secondary font-main mt-4">or connect with</span>

          <div className="flex sm:justify-between w-full gap-2">
            <button className="font-second gap-2 items-center justify-center border  px-4 py-2 inline-flex text-info border-line ">
              <Discord /> <span className="text-fg uppercase hidden sm:block">discord</span>
            </button>

            <button className="font-second gap-2 items-center justify-center border  px-4 py-2 inline-flex border-line text-fg">
              <Github /> <span className="text-fg uppercase hidden sm:block">github</span>
            </button>

            <button className="font-second gap-2 items-center justify-center border  px-4 py-2 inline-flex text-accent border-line ">
              <Google /> <span className="text-fg uppercase hidden sm:block">google</span>
            </button>
          </div>

          <div>
            {errors.root && (
              <span className="text-danger bg-red-50 rounded-lg py-2">{errors.root.message}</span>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="justify-center uppercase flex w-full py-2 bg-accent text-on-accent mt-5 text-center font-main"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>

        <div className="flex gap-1 sm:gap-5 mb-50 font-second flex-col-reverse sm:flex-row">
          <p className="text-danger">Forgot password</p>
          <p className="text-secondary uppercase">
            New player?{" "}
            <Link to="/signup" className="underline">
              Create account &gt;
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
