import { auth } from "./firebase";
import {
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

export const handleUserRegister = async (email: string, password: string) => {
  console.log("register input: ", { email, password });
  await createUserWithEmailAndPassword(auth, email, password);
};

export const handleUserSignIn = async (email: string, password: string) => {
  console.log("email input: ", { email, password });
  await signInWithEmailAndPassword(auth, email, password);
};

export const handleUserSignOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.log("sign out firebase error: ", error);
  }
};
