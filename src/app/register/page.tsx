"use client";

import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import { handleUserRegister } from "@/actions/firebase-actions";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";

type RegisterInput = {
  emailRegister: string;
  usernameRegister: string;
  passwordRegister: string;
  confirmPasswordRegister: string;
};

export default function RegisterPage() {
  const { register, handleSubmit, watch, reset } = useForm<RegisterInput>();

  const onSubmit: SubmitHandler<RegisterInput> = async (data) => {
    if (data.passwordRegister !== data.confirmPasswordRegister) {
      console.log("Trigger Toast Password is not the same");
      return;
    }
    let submitErr = false;

    const resUID = await handleUserRegister(
      data.emailRegister,
      data.passwordRegister,
      data.usernameRegister
    ).catch((e) => {
      submitErr = true;
      console.log("submit register error: ", e);
    });

    if (!submitErr) {
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
                <Input
                  key={id}
                  id={id}
                  type={type}
                  placeholder={placeholder}
                  {...register}
                />
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
