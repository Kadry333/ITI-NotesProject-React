import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router";
import toast from "react-hot-toast";

import { loginSchema } from "../validations/loginSchema";
import { login } from "../services/authService";
import { setCredentials } from "../redux/authSlice";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data) => {
    try {
      const response = await login(data);
      dispatch(setCredentials({ user: response.user, token: response.token }));
      toast.success(`Welcome back, ${response.user.name}`);
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-(--color-neutral-secondary-soft) px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center border-2 border-(--color-border-default) bg-(--color-brand) font-(family-name:--font-head) text-2xl text-black shadow-(--shadow-md)">
            N
          </div>
          <h2 className="mt-4 text-center text-3xl text-(--color-heading)">SmartNotes</h2>
          <p className="mt-1.5 text-center text-sm text-(--color-body)">
            Enter details to access your workspace
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="border-2 border-(--color-border-default) bg-(--color-neutral-primary-soft) p-8 shadow-(--shadow-lg)"
        >
          <div className="mb-4">
            <label htmlFor="email" className="mb-2 block text-sm font-semibold text-(--color-heading)">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="e.g. john@example.com"
              {...register("email")}
              className="w-full border-2 border-(--color-border-default) bg-(--color-neutral-primary-soft) px-4 py-3 text-sm text-(--color-heading) shadow-(--shadow-xs) outline-none transition-all placeholder:text-(--color-body) focus:border-(--color-border-brand) focus:shadow-(--shadow-sm)"
            />
            {errors.email && (
              <p className="mt-1.5 text-xs font-semibold text-(--color-fg-danger-strong)">{errors.email.message}</p>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="mb-2 block text-sm font-semibold text-(--color-heading)">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
              className="w-full border-2 border-(--color-border-default) bg-(--color-neutral-primary-soft) px-4 py-3 text-sm text-(--color-heading) shadow-(--shadow-xs) outline-none transition-all placeholder:text-(--color-body) focus:border-(--color-border-brand) focus:shadow-(--shadow-sm)"
            />
            {errors.password && (
              <p className="mt-1.5 text-xs font-semibold text-(--color-fg-danger-strong)">{errors.password.message}</p>
            )}
          </div>

          <button
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 border-2 border-(--color-border-default) bg-(--color-brand) py-3.5 text-sm font-semibold text-black shadow-(--shadow-sm) transition-all hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-(--shadow-md) active:translate-x-0.5 active:translate-y-0.5 active:shadow-(--shadow-2xs) disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black"></div>
                <span>Securing workspace...</span>
              </>
            ) : (
              "Login to Workspace"
            )}
          </button>

          <p className="mt-6 text-center text-sm text-(--color-body)">
            Don't have an account?{" "}
            <Link to="/register" className="font-semibold text-(--color-fg-brand) underline hover:no-underline">
              Register now
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;