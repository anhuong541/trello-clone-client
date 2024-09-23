import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";

export type UserType = {
  isActive: boolean;
  password: string;
  email: string;
  uid: string;
  activationHash: string | null;
  createAt: number;
  username: string;
};

export const UserDataContext = createContext<{
  userDataStore: UserType | null;
  setUserDataStore: Dispatch<SetStateAction<UserType | null>>;
}>({ userDataStore: null, setUserDataStore: () => {} });

export default function UserInfoContextProvider({ children }: { children: ReactNode }) {
  const [userDataStore, setUserDataStore] = useState<UserType | null>(null);

  return (
    <UserDataContext.Provider value={{ userDataStore, setUserDataStore }}>
      {children}
    </UserDataContext.Provider>
  );
}

export const UserInfoContextHook = () => {
  return useContext(UserDataContext);
};
