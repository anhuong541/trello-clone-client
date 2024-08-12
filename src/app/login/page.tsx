"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";

import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { reactQueryKeys } from "@/lib/react-query-keys";
import { onUserLogin } from "@/actions/query-actions";
import { useRouter } from "next/navigation";

type LoginInput = {
  emailLogin: string;
  passwordLogin: string;
};

export default function LoginPage() {
  const router = useRouter();
  const { register, handleSubmit, watch, reset } = useForm<LoginInput>();

  const loginAction = useMutation({
    mutationFn: onUserLogin,
    mutationKey: [reactQueryKeys.login],
  });

  const onSubmit: SubmitHandler<LoginInput> = async (data) => {
    if (data.emailLogin === "" || data.passwordLogin === "") {
      console.log("Trigger Toast input is empty");
      return;
    }
    let submitErr = false;

    const res = await loginAction.mutateAsync({
      email: data.emailLogin,
      password: data.passwordLogin,
    });

    if (!submitErr && res?.status === 200) {
      reset();
      router.push("/project");
    }
  };

  return (
    <main className="flex h-screen container m-auto">
      <div className="m-auto shadow-md shadow-dark-600 py-10 px-6 sm:w-[440px] w-full">
        <div className="flex flex-col gap-4">
          <h1 className="font-bold text-blue-500 text-4xl">
            Login Trello Clone
          </h1>
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Input
              {...register("emailLogin")}
              required={true}
              type="email"
              placeholder="Enter your email"
            />

            <Input
              {...register("passwordLogin")}
              required={true}
              type="password"
              placeholder="Enter your Password"
            />
            <Button type="submit">Sign in</Button>
          </form>
          <Link
            href="/register"
            className="text-blue-500 hover:opacity-80 active:opacity-50 hover:underline"
          >
            You didn&lsquo;t have an account yet?
          </Link>
        </div>
      </div>
    </main>
  );
}
