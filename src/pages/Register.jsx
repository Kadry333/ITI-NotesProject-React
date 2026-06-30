import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router";
import toast from "react-hot-toast";

import { registerSchema } from "../validations/registerSchema";
import { register as registerUser } from "../services/authService";
import { setCredentials } from "../redux/authSlice";

const fields = [
  { name: "name", label: "Full Name", type: "text", placeholder: "e.g. John Doe" },
  { name: "email", label: "Email Address", type: "email", placeholder: "e.g. john@example.com" },
  { name: "password", label: "Password", type: "password", placeholder: "Min. 8 characters" },
  { name: "confirmPassword", label: "Confirm Password", type: "password", placeholder: "Re-type password" },
];

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data) => {
    try {
      const response = await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      dispatch(setCredentials({ user: response.user, token: response.token }));
      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed. Try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-(--color-neutral-secondary-soft) px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center border-2 border-(--color-border-default) bg-(--color-brand) font-(family-name:--font-head) text-2xl text-black shadow-(--shadow-md)">
            N
          </div>
          <h2 className="mt-4 text-center text-3xl text-(--color-heading)">Join SmartNotes</h2>
          <p className="mt-1.5 text-center text-sm text-(--color-body)">
            Create your account to start managing notes
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="border-2 border-(--color-border-default) bg-(--color-neutral-primary-soft) p-8 shadow-(--shadow-lg)"
        >
          {fields.map((f) => (
            <div key={f.name} className={f.name === "confirmPassword" ? "mb-6" : "mb-4"}>
              <label htmlFor={f.name} className="mb-2 block text-sm font-semibold text-(--color-heading)">
                {f.label}
              </label>
              <input
                id={f.name}
                type={f.type}
                placeholder={f.placeholder}
                {...register(f.name)}
                className="w-full border-2 border-(--color-border-default) bg-(--color-neutral-primary-soft) px-4 py-3 text-sm text-(--color-heading) shadow-(--shadow-xs) outline-none transition-all placeholder:text-(--color-body) focus:border-(--color-border-brand) focus:shadow-(--shadow-sm)"
              />
              {errors[f.name] && (
                <p className="mt-1.5 text-xs font-semibold text-(--color-fg-danger-strong)">
                  {errors[f.name].message}
                </p>
              )}
            </div>
          ))}

          <button
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 border-2 border-(--color-border-default) bg-(--color-brand) py-3.5 text-sm font-semibold text-black shadow-(--shadow-sm) transition-all hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-(--shadow-md) active:translate-x-0.5 active:translate-y-0.5 active:shadow-(--shadow-2xs) disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black"></div>
                <span>Creating workspace...</span>
              </>
            ) : (
              "Create Account"
            )}
          </button>

          <p className="mt-6 text-center text-sm text-(--color-body)">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-(--color-fg-brand) underline hover:no-underline">
              Login now
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;