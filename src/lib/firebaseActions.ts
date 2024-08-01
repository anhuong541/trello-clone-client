import { auth } from "./firebase";
import {
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

export const handleUserRegister = async (email: string, password: string) => {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.log("register firebase error: ", error);
  }
};

export const handleUserSignIn = async (email: string, password: string) => {
  try {
    console.log("email input: ", { email, password });
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.log("login firebase error: ", error);
  }
};

export const handleUserSignOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.log("sign out firebase error: ", error);
  }
};
