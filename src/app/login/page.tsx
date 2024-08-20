"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { reactQueryKeys } from "@/lib/react-query-keys";
import { toast } from "react-toastify";
import { useState } from "react";
import { capitalizeFirstLetter } from "@/lib/utils";
import { onUserLogin } from "@/actions/query-actions";

type LoginInput = {
  emailLogin: string;
  passwordLogin: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [emailErr, setEmailErr] = useState(false);
  const [passwordErr, setPasswordError] = useState(false);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { register, handleSubmit, watch, reset } = useForm<LoginInput>();

  const loginAction = useMutation({
    mutationFn: onUserLogin,
    mutationKey: [reactQueryKeys.login],
  });

  const onSubmit: SubmitHandler<LoginInput> = async (data) => {
    setIsLoadingSubmit(true);
    if (data.emailLogin === "" || data.passwordLogin === "") {
      toast.warning("You need to fill all the input first!");
      return;
    }
    let submitErr = false;
    const res = await loginAction
      .mutateAsync({
        email: data.emailLogin,
        password: data.passwordLogin,
      })
      .catch((err) => {
        if (err?.response?.status === 404 || err?.response?.status === 403) {
          setEmailErr(true);
          setPasswordError(false);
        } else if (err?.response?.status === 401) {
          setEmailErr(false);
          setPasswordError(true);
        }
        setErrorMsg(capitalizeFirstLetter(err?.response?.data?.error));
        if (err?.response?.status === 403) {
          toast.error(capitalizeFirstLetter("You need to active your account"));
        }
        console.log("error: ", err);
      });

    if (!submitErr && res?.status === 200) {
      router.push("/project");
      setEmailErr(false);
      reset();
    }
    setIsLoadingSubmit(false);
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
            <label className="flex flex-col gap-1" htmlFor="emailLogin">
              <Input
                {...register("emailLogin")}
                required={true}
                type="email"
                placeholder="Enter your email"
              />
              {emailErr && <p className="text-xs text-red-500">{errorMsg}</p>}
            </label>

            <label className="flex flex-col gap-1" htmlFor="emailLogin">
              <Input
                {...register("passwordLogin")}
                required={true}
                type="password"
                placeholder="Enter your Password"
              />
              {passwordErr && (
                <p className="text-xs text-red-500">{errorMsg}</p>
              )}
            </label>

            <Button type="submit" disabled={isLoadingSubmit}>
              Sign in
            </Button>
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
