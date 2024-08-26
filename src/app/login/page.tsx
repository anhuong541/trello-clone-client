"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { reactQueryKeys } from "@/lib/react-query-keys";
import { toast } from "react-toastify";
import { useState } from "react";
import { capitalizeFirstLetter } from "@/lib/utils";
import { onUserLogin } from "@/actions/query-actions";
import { AuthFormInput } from "@/types";
import AuthForm from "@/components/common/auth-form";

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
    setEmailErr(false);
    setPasswordError(false);
    setIsLoadingSubmit(true);
    if (data.emailLogin === "" || data.passwordLogin === "") {
      toast.warning("You need to fill all the input first!");
      return;
    }
    const res = await loginAction
      .mutateAsync({
        email: data.emailLogin,
        password: data.passwordLogin,
      })
      .catch((err) => {
        if (err?.response?.status === 404 || err?.response?.status === 403) {
          setEmailErr(true);
        } else if (err?.response?.status === 401) {
          setPasswordError(true);
        }
        setErrorMsg(capitalizeFirstLetter(err?.response?.data?.error));
        if (err?.response?.status === 403) {
          toast.error(capitalizeFirstLetter("You need to active your account"));
        }
        console.log("error: ", err);
      });

    if (res?.status === 200) {
      router.push("/project");
      setEmailErr(false);
      reset();
    }
    setIsLoadingSubmit(false);
  };

  const data: AuthFormInput = {
    title: "Login Trello Clone",
    form: [
      {
        id: "login-email",
        register: { ...register("emailLogin") },
        type: "email",
        placeholder: "Enter your email",
        err: emailErr,
        errorMsg: errorMsg,
      },
      {
        id: "login-password",
        register: { ...register("passwordLogin") },
        type: "password",
        placeholder: "Enter your Password",
        err: passwordErr,
        errorMsg: errorMsg,
      },
    ],
    submit: {
      text: "Sign in",
      isLoadingSubmit,
    },
    link: {
      href: "/register",
      text: "You didn't have an account yet?",
    },
  };

  return (
    <main className="flex h-screen container m-auto">
      <AuthForm data={data} onSubmit={handleSubmit(onSubmit)} />
    </main>
  );
}
