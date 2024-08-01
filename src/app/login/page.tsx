"use client";

import { Box, Button, Container, Typography } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect } from "react";
import Link from "next/link";

import CurrentUserFirebase from "@/hooks/user";
import { handleUserSignIn, handleUserSignOut } from "@/lib/firebaseActions";

type LoginInput = {
  emailLogin: string;
  passwordLogin: string;
};

export default function LoginPage() {
  const { register, handleSubmit, watch, reset } = useForm<LoginInput>();

  const { user: userCurrentData, loading: isLoadingUser } =
    CurrentUserFirebase();

  useEffect(() => {
    console.log({ user: userCurrentData?.uid });
  }, [userCurrentData]);

  const onSubmit: SubmitHandler<LoginInput> = async (data) => {
    if (data.emailLogin === "" || data.passwordLogin === "") {
      console.log("Trigger Toast input is empty");
      return;
    }
    let submitErr = false;

    await handleUserSignIn(data.emailLogin, data.passwordLogin).catch((e) => {
      console.log("submit login error: ", e);
      submitErr = true;
    });

    if (!submitErr) {
      reset();
    }
  };

  return (
    <main className="flex h-screen container m-auto">
      <Container
        maxWidth="xs"
        className="m-auto shadow-md shadow-dark-600 py-10"
      >
        <Box display="flex" flexDirection="column" gap={4}>
          <Typography variant="h1" className="font-bold text-blue-500 text-4xl">
            Login Trello Clone
          </Typography>
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <input
              {...register("emailLogin")}
              required={true}
              type="email"
              placeholder="Enter your email"
              className="px-4 py-2 border border-blue-400  rounded-md shadow-md"
            />
            <input
              {...register("passwordLogin")}
              required={true}
              type="password"
              placeholder="Enter your Password"
              className="px-4 py-2 border border-blue-400  rounded-md shadow-md"
            />
            <Button variant="contained" type="submit">
              Sign in
            </Button>

            <Button variant="contained" onClick={handleUserSignOut}>
              Sign Out
            </Button>
          </form>
          <Link
            href="/register"
            className="text-blue-500 hover:opacity-80 active:opacity-50 hover:underline"
          >
            You didn&lsquo;t have an account yet?
          </Link>
        </Box>
      </Container>
    </main>
  );
}
