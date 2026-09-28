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
    <main className="mx-auto flex flex-col p-2 bg-black justify-center ">
      <header className="mx-auto w-110 flex-col pb-5">
        <img src={logo} alt="logo" />
      </header>

      <div className="mx-auto max-w-md">
        <div className="mb-4">
          <h1 className="uppercase text-green font-main text-lg text-nowrap ">
            {" "}
            &gt; User authentication
          </h1>
          <p className="font-second text-sm text-grey">
            Access your global save progress and arcade rank.
          </p>
        </div>

        <form className="gap-2 flex-col flex" onSubmit={handleSubmit(onSubmit)}>
          <label className="uppercase text-grey font-main text-sm" htmlFor="email">
            &gt; Email:{" "}
          </label>

          <input
            className="block w-full border border-grey py-2 placeholder:uppercase text-grey font-second "
            placeholder="&gt; pixel_ "
            id="email"
            type="email"
            autoComplete="email"
            {...register("email")}
          />
          {errors.email && <p className="text-xs text-pink">{errors.email.message}</p>}
          <label
            className="
                        uppercase text-grey font-main text-sm "
            htmlFor="password"
          >
            &gt; Password:
          </label>

          <input
            className="font-second block w-full border border-grey py-2 placeholder:uppercase text-grey "
            id="password"
            placeholder="&gt; enter secure pass"
            type="password"
            autoComplete="current-password"
            {...register("password")}
          />
          {errors.password && <p className="text-xs text-pink">{errors.password.message}</p>}
          <p className="uppercase text-violet font-main mt-4 text-xs">or connect with</p>

          <div className="flex justify-between w-full gap-2">
            <button className="font-second gap-2 items-center justify-center border  px-4 py-2 inline-flex text-blue border-grey ">
              <Discord /> <span className="text-white">discord</span>
            </button>

            <button className="font-second gap-2 items-center justify-center border  px-4 py-2 inline-flex border-grey text-white">
              <Github /> <span className="text-white">github</span>
            </button>

            <button className="font-second gap-2 items-center justify-center border  px-4 py-2 inline-flex text-green border-grey ">
              <Google /> <span className="text-white">google</span>
            </button>
          </div>

          <div>
            {errors.root && (
              <p className="text-sm text-pink bg-red-50 rounded-lg px-3 py-2">
                {errors.root.message}
              </p>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className=" justify-center uppercase mx-auto flex w-full  py-2 bg-green mt-5 text-center font-main"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>

        <div className="flex gap-5 mb-50 font-second ">
          <p className="text-pink">Forgot password</p>
          <p className="text-violet uppercase">
            New player?
            <Link to="/signup"> Create account &gt;</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
