"use client";

import CurrentUserFirebase from "@/hooks/user";
import { handleUserSignIn } from "@/lib/firebaseActions";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import Link from "next/link";
import { FormEvent, useEffect, useRef } from "react";

export default function LoginPage() {
  const emailRef = useRef<{ value: string } | null>(null);
  const passwordRef = useRef<{ value: string } | null>(null);

  const { user: userCurrentData, loading: isLoadingUser } =
    CurrentUserFirebase();

  useEffect(() => {
    console.log({ user: userCurrentData?.uid });
  }, [userCurrentData]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const checkRefValue =
      emailRef?.current?.value && passwordRef?.current?.value !== null
        ? true
        : false;

    if (emailRef.current?.value === "" || passwordRef.current?.value === "") {
      console.log("Trigger Toast");
      return;
    }

    if (!checkRefValue) {
      console.log("Trigger Toast");
      return;
    }

    await handleUserSignIn(
      emailRef.current?.value ?? "",
      passwordRef.current?.value ?? ""
    );

    console.log("Trigger Success");
    // doesn't clear data input yet!!

    emailRef.current = { value: "" };
    passwordRef.current = { value: "" };
  };

  return (
    <main className="flex h-screen">
      <Container
        maxWidth="xs"
        className="m-auto shadow-md shadow-dark-600 py-10"
      >
        <Box display="flex" flexDirection="column" gap={4}>
          <Typography variant="h1" className="font-bold text-blue-500 text-4xl">
            Login Trello Clone
          </Typography>
          <form className="flex flex-col gap-4" onSubmit={onSubmit}>
            <TextField
              inputRef={emailRef}
              id="email-register"
              label="Email"
              variant="outlined"
              type="email"
              placeholder="Enter your email"
            />
            <TextField
              inputRef={passwordRef}
              id="password-register"
              label="Password"
              variant="outlined"
              type="password"
              placeholder="Enter your Password"
            />
            <Button variant="contained" type="submit">
              Sign in
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
