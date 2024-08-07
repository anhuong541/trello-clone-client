import { auth } from "@/lib/firebase";
import { userIdStore } from "@/lib/stores";
import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";

export default function CurrentUserFirebase() {
  const { updateUID } = userIdStore();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      updateUID(user?.uid ?? "");
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return { user, loading };
}
