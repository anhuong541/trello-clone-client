import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "@firebase/auth";
import { auth } from "./firebase";

export const handleUserRegister = async (email: string, password: string) => {
  await createUserWithEmailAndPassword(auth, email, password);
};

export const handleUserSignIn = async (email: string, password: string) => {
  await signInWithEmailAndPassword(auth, email, password);
};
