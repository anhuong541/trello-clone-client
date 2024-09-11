"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { reactQueryKeys } from "@/lib/react-query-keys";
import { onUserLogin } from "@/actions/query-actions";
import AuthForm from "@/components/common/auth-form";
import { capitalizeFirstLetter } from "@/lib/utils";
import { AuthFormInput } from "@/types";
import { isProduction } from "@/lib/network";
import { createSession } from "@/actions/auth-action";

type LoginInput = {
  emailLogin: string;
  passwordLogin: string;
};

export default function Login() {
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
      isProduction && createSession(res?.data.token);
      // router.push("/project");
      setEmailErr(false);
      reset();
      return;
    } else {
      setIsLoadingSubmit(false);
    }
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
    onSubmit: handleSubmit(onSubmit),
  };

  return <AuthForm data={data} />;
}
