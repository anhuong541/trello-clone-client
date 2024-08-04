import { auth } from "../lib/firebase";
import {
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { createSession, removeSession } from "./auth-action";

export const handleUserRegister = async (email: string, password: string) => {
  console.log("register input: ", { email, password });
  const res = await createUserWithEmailAndPassword(auth, email, password);
  await createSession(res.user.uid);
};

export const handleUserSignIn = async (email: string, password: string) => {
  console.log("email input: ", { email, password });
  const res = await signInWithEmailAndPassword(auth, email, password);
  await createSession(res.user.uid);
};

export const handleUserSignOut = async () => {
  try {
    await signOut(auth);
    await removeSession();
  } catch (error) {
    console.log("sign out firebase error: ", error);
  }
};
