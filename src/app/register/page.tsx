"use client";

import Link from "next/link";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { FormEvent, useRef } from "react";
import { handleUserRegister } from "@/lib/firebaseActions";

export default function RegisterPage() {
  const emailRef = useRef<{ value: string } | null>(null);
  const usernameRef = useRef<{ value: string } | null>(null);
  const passwordRef = useRef<{ value: string } | null>(null);
  const confirmPasswordRef = useRef<{ value: string } | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const checkRefValue =
      emailRef?.current?.value &&
      usernameRef?.current?.value &&
      passwordRef?.current?.value &&
      confirmPasswordRef?.current?.value !== null
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

    if (passwordRef?.current?.value !== confirmPasswordRef?.current?.value) {
      console.log("Trigger Toast");
      return;
    }

    await handleUserRegister(
      emailRef.current?.value ?? "",
      passwordRef.current?.value ?? ""
    );

    console.log("Trigger Success");
    // doesn't clear data input yet!!

    emailRef.current = { value: "" };
    passwordRef.current = { value: "" };
    usernameRef.current = { value: "" };
    confirmPasswordRef.current = { value: "" };
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
              inputRef={usernameRef}
              id="username-register"
              label="Username"
              variant="outlined"
              type="text"
              placeholder="Enter your Username"
            />
            <TextField
              inputRef={passwordRef}
              id="password-register"
              label="Password"
              variant="outlined"
              type="password"
              placeholder="Enter your Password"
            />
            <TextField
              inputRef={confirmPasswordRef}
              id="confirm-password-register"
              label="Confirm Password"
              variant="outlined"
              type="password"
              placeholder="Confirm your Password"
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
