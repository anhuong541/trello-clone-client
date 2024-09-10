"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import { reactQueryKeys } from "@/lib/react-query-keys";
import { onUserRegister } from "@/actions/query-actions";
import { useState } from "react";
import { AuthFormInput } from "@/types";
import AuthForm from "@/components/common/auth-form";
import { isProduction } from "@/lib/network";
import { createSession } from "@/actions/auth-action";

type RegisterInput = {
  emailRegister: string;
  usernameRegister: string;
  passwordRegister: string;
  confirmPasswordRegister: string;
};

export default function Register() {
  const router = useRouter();
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const { register, handleSubmit, watch, reset } = useForm<RegisterInput>();
  const [emailErr, setEmailErr] = useState<boolean>(false);
  const [passwordErr, setPasswordErr] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const registerAction = useMutation({
    mutationFn: onUserRegister,
    mutationKey: [reactQueryKeys.register],
  });

  const onSubmit: SubmitHandler<RegisterInput> = async (data) => {
    setEmailErr(false);
    setPasswordErr(false);
    setIsLoadingSubmit(true);
    if (data.passwordRegister !== data.confirmPasswordRegister) {
      toast.warning("Passwords do not match. Please ensure both entries are identical.");
      setPasswordErr(true);
      setErrorMsg("Passwords do not match");
      setIsLoadingSubmit(false);
      return;
    }

    const res = await registerAction
      .mutateAsync({
        email: data.emailRegister,
        password: data.passwordRegister,
        username: data.usernameRegister,
      })
      .catch((err) => {
        if (err?.response?.status === 409) {
          toast.warning("This email have been used!!!");
          setEmailErr(true);
          setErrorMsg("This email have been used!!!");
        }
      });

    if (res?.status === 200) {
      isProduction && createSession(res?.data.token);
      router.push("/active");
      reset();
    } else {
      setIsLoadingSubmit(false);
    }
  };

  const data: AuthFormInput = {
    title: "Register",
    form: [
      {
        register: { ...register("emailRegister") },
        id: "email-register",
        type: "email",
        placeholder: "Enter your email",
        err: emailErr,
        errorMsg: errorMsg,
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
        err: passwordErr,
        errorMsg: errorMsg,
      },
      {
        register: { ...register("confirmPasswordRegister") },
        id: "confirm-password-register",
        type: "password",
        placeholder: "Confirm your Password",
      },
    ],
    submit: {
      text: "Sign up",
      isLoadingSubmit,
    },
    link: {
      href: "/login",
      text: "You already have an account?",
    },
    onSubmit: handleSubmit(onSubmit),
  };

  return <AuthForm data={data} />;
}
