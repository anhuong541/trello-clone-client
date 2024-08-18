"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";

import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { reactQueryKeys } from "@/lib/react-query-keys";
import { onUserRegister } from "@/actions/query-actions";
import { createSession } from "@/actions/auth-action";

type RegisterInput = {
  emailRegister: string;
  usernameRegister: string;
  passwordRegister: string;
  confirmPasswordRegister: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const { register, handleSubmit, watch, reset } = useForm<RegisterInput>();

  const registerAction = useMutation({
    mutationFn: onUserRegister,
    mutationKey: [reactQueryKeys.register],
  });

  const onSubmit: SubmitHandler<RegisterInput> = async (data) => {
    if (data.passwordRegister !== data.confirmPasswordRegister) {
      toast.warning("Password is not the same with confirm");
      return;
    }
    let submitErr = true;

    const res = await registerAction
      .mutateAsync({
        email: data.emailRegister,
        password: data.passwordRegister,
        username: data.usernameRegister,
      })
      .catch((err) => {
        if (err?.response?.status === 409) {
          toast.warning("This is email have been used!!!");
        }
      });

    submitErr = false;
    if (!submitErr && res?.status === 200) {
      // await createSession(res.data.userId);
      router.push("/project");
      reset();
    }
  };

  const registerFormData = [
    {
      register: { ...register("emailRegister") },
      id: "email-register",
      type: "email",
      placeholder: "Enter your email",
    },
    {
      register: { ...register("usernameRegister") },
      id: "username-register",
      type: "text",
      placeholder: "Enter your Username",
    },
    {
      register: { ...register("passwordRegister") },
      id: "password-register",
      type: "password",
      placeholder: "Enter your Password",
    },
    {
      register: { ...register("confirmPasswordRegister") },
      id: "confirm-password-register",
      type: "password",
      placeholder: "Confirm your Password",
    },
  ];

  return (
    <main className="flex h-screen container m-auto">
      <div className="m-auto shadow-md shadow-dark-600 py-10 px-6 sm:w-[440px] w-full">
        <div className="flex flex-col gap-4">
          <h1 className="font-bold text-blue-500 text-4xl">Register</h1>
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            {registerFormData.map(({ register, id, type, placeholder }) => {
              return (
                <div key={id} className="flex gap-2">
                  <Input
                    id={id}
                    type={type}
                    placeholder={placeholder}
                    {...register}
                  />
                </div>
              );
            })}
            <Button type="submit">Sign up</Button>
          </form>
          <Link
            href="/login"
            className="text-blue-500 hover:opacity-80 active:opacity-50 hover:underline"
          >
            You already have an account?
          </Link>
        </div>
      </div>
    </main>
  );
}
