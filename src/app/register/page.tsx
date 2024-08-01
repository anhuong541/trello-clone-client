"use client";

import Link from "next/link";
import { Box, Button, Container, Typography } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { handleUserRegister } from "@/lib/firebase-actions";
import CurrentUserFirebase from "@/hooks/user";
import { useEffect } from "react";

type RegisterInput = {
  emailRegister: string;
  usernameRegister: string;
  passwordRegister: string;
  confirmPasswordRegister: string;
};

export default function RegisterPage() {
  const { register, handleSubmit, watch, reset } = useForm<RegisterInput>();

  const { user: userCurrentData, loading: isLoadingUser } =
    CurrentUserFirebase();

  useEffect(() => {
    console.log({ user: userCurrentData?.uid });
  }, [userCurrentData]);

  const onSubmit: SubmitHandler<RegisterInput> = async (data) => {
    if (data.passwordRegister !== data.confirmPasswordRegister) {
      console.log("Trigger Toast Password is not the same");
      return;
    }
    let submitErr = false;

    await handleUserRegister(data.emailRegister, data.passwordRegister).catch(
      (e) => {
        submitErr = true;
        console.log("submit register error: ", e);
      }
    );

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
            Register
          </Typography>
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <input
              {...register("emailRegister")}
              id="email-register"
              type="email"
              placeholder="Enter your email"
              className="px-4 py-2 border border-blue-400 rounded-md shadow-md"
            />
            <input
              {...register("usernameRegister")}
              id="username-register"
              type="text"
              placeholder="Enter your Username"
              className="px-4 py-2 border border-blue-400 rounded-md shadow-md"
            />
            <input
              {...register("passwordRegister")}
              id="password-register"
              type="password"
              placeholder="Enter your Password"
              className="px-4 py-2 border border-blue-400 rounded-md shadow-md"
            />
            <input
              {...register("confirmPasswordRegister")}
              id="confirm-password-register"
              type="password"
              placeholder="Confirm your Password"
              className="px-4 py-2 border border-blue-400 rounded-md shadow-md"
            />
            <Button variant="contained" type="submit">
              Sign up
            </Button>
          </form>
          <Link
            href="/login"
            className="text-blue-500 hover:opacity-80 active:opacity-50 hover:underline"
          >
            You already have an account?
          </Link>
        </Box>
      </Container>
    </main>
  );
}
