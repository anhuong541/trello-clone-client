"use client";

import { Box, Button, Container, Typography } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect } from "react";
import Link from "next/link";

import CurrentUserFirebase from "@/hooks/user";
import {
  handleUserSignIn,
  handleUserSignOut,
} from "@/actions/firebase-actions";
import axios from "axios";
import { Input } from "@/components/common/Input";

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

  const getApi = async () => {
    await axios.get("http://localhost:3456/");
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
            <Button variant="contained" type="submit">
              Sign in
            </Button>

            <Button variant="contained" onClick={handleUserSignOut}>
              Sign Out
            </Button>

            <Button variant="contained" onClick={getApi}>
              Api
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
