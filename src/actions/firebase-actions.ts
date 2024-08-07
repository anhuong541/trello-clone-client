// import { auth, firestore } from "../lib/firebase";
// import {
//   signOut,
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
// } from "firebase/auth";
// import { createSession, removeSession } from "./auth-action";
// import {
//   addDoc,
//   collection,
//   doc,
//   DocumentData,
//   getDocs,
//   query,
//   setDoc,
// } from "firebase/firestore";

// export const handleUserRegister = async (
//   email: string,
//   password: string,
//   username: string
// ) => {
//   console.log("register input: ", { email, password });
//   const res = await createUserWithEmailAndPassword(auth, email, password);
//   await setDoc(doc(firestore, "users", res.user.uid), {
//     userName: username,
//     email,
//     createAt: Date.now(),
//   });
//   await createSession(res.user.uid);

//   return res.user.uid;
// };

// export const handleUserSignIn = async (email: string, password: string) => {
//   console.log("login input: ", { email, password });
//   const res = await signInWithEmailAndPassword(auth, email, password);
//   await createSession(res.user.uid);

//   return res.user.uid;
// };

// export const handleUserSignOut = async () => {
//   try {
//     await signOut(auth);
//     await removeSession();
//   } catch (error) {
//     console.log("sign out firebase error: ", error);
//   }
// };

// export const onCreateNewProject = async (
//   userId: string,
//   projectName: string
// ) => {
//   await addDoc(collection(firestore, "users", userId, "projects"), {
//     projectName,
//     createAt: Date.now(),
//   });
// };

// export const handlerUserProjectList = async (userId: string) => {
//   const q = query(collection(firestore, "users", userId, "projects"));
//   const querySnapshot = await getDocs(q);
//   let dataRes: DocumentData[] = [];
//   querySnapshot.forEach((doc) => {
//     dataRes.push(doc.data());
//   });
//   return dataRes;
// };
