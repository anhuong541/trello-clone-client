"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { MouseEvent, useState } from "react";
import { toast } from "react-toastify";
import Link from "next/link";

import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { reactQueryKeys } from "@/lib/react-query-keys";
import { onUserRegister, onUserVerifyEmail } from "@/actions/query-actions";

type RegisterInput = {
  emailRegister: string;
  usernameRegister: string;
  passwordRegister: string;
  confirmPasswordRegister: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const { register, handleSubmit, watch, reset } = useForm<RegisterInput>();
  const [emailVerified, setEmailVerified] = useState(false);

  const registerAction = useMutation({
    mutationFn: onUserRegister,
    mutationKey: [reactQueryKeys.register],
  });

  const checkEmailAction = useMutation({
    mutationFn: onUserVerifyEmail,
    mutationKey: [reactQueryKeys.emailVerify],
  });

  const onSubmit: SubmitHandler<RegisterInput> = async (data) => {
    if (data.passwordRegister !== data.confirmPasswordRegister) {
      toast.warning("Password is not the same with confirm");
      return;
    }
    let submitErr = true;

    const res = await registerAction.mutateAsync({
      email: data.emailRegister,
      password: data.passwordRegister,
      username: data.usernameRegister,
    });

    submitErr = false;
    if (!submitErr && res?.status === 200) {
      reset();
      router.push("/project");
    }
  };

  const onVerifyEmail = async (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    e.preventDefault();
    const email = watch("emailRegister");
    if (email === "") {
      toast.warning("You have to type your email first");
      return;
    }
    const result = await checkEmailAction.mutateAsync(email);
    if (result?.data && !result?.data.used) {
      toast.success("You can use this email");
      setEmailVerified(true);
    } else if (result?.data && result?.data.used) {
      toast.warn("This is email have been used!!!");
    } else {
      toast.error("Something wrong at the server");
    }
  };

  const registerFormData = [
    {
      register: { ...register("emailRegister") },
      id: "email-register",
      type: "email",
      placeholder: "Enter your email",
      checkEmail: true,
    },
    {
      register: { ...register("usernameRegister") },
      id: "username-register",
      type: "text",
      placeholder: "Enter your Username",
      checkEmail: false,
    },
    {
      register: { ...register("passwordRegister") },
      id: "password-register",
      type: "password",
      placeholder: "Enter your Password",
      checkEmail: false,
    },
    {
      register: { ...register("confirmPasswordRegister") },
      id: "confirm-password-register",
      type: "password",
      placeholder: "Confirm your Password",
      checkEmail: false,
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
            {registerFormData.map(
              ({ register, id, type, placeholder, checkEmail }) => {
                return (
                  <div key={id} className="flex gap-2">
                    <Input
                      id={id}
                      type={type}
                      placeholder={placeholder}
                      {...register}
                    />
                    {checkEmail && (
                      <Button
                        className="text-sm whitespace-nowrap px-2"
                        onClick={onVerifyEmail}
                      >
                        Verify Email
                      </Button>
                    )}
                  </div>
                );
              }
            )}
            <Button type="submit" disabled={!emailVerified}>
              Sign up
            </Button>
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
