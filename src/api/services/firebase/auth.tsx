import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { Firebase } from "./setup";
import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
export const auth = getAuth(Firebase);
  
  
  
  
export const logInFirebase = async (email: string, password: string) => {
  try {
    const authUser = await signInWithEmailAndPassword(auth, email, password);
    console.log({ authUser });
    const user: any = authUser.user.toJSON();
    console.log({ user });
    return { id: user.uid, token: user.stsTokenManager.accessToken };
  } catch (error: any) {
    console.log(error);
  }
};

export const logOut = async () => {
    await signOut(auth);
};

interface User {
  id: string;
  role: string;
  token: string;
  type: string;
}

interface AuthError {
  message?: string;
}

interface AuthContextData {
  logged: boolean;
  user: User | null;
  logIn(email?: string, password?: string): Promise<any>;
  logOut(): void;
  setLoading(loading: boolean): void;
  loading: boolean;
  error: AuthError;
  saveImage(data: Blob, ref: string): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

type Props = {
  children?: React.ReactNode
};

export function AuthProvider({children}: Props): any {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>("");

  //Para manter logado
  useEffect(() => {
    async function loadStorageData() {
      const storagedUser = localStorage.getItem("@Auth:userId");
      const storagedRole = localStorage.getItem("@Auth:userRole");
      const storagedToken = localStorage.getItem("@Auth:accessToken");
      const storagedType = localStorage.getItem("@Auth:userType");

      if (storagedUser && storagedToken && storagedType && storagedRole) {
        setUser({
          id: storagedUser,
          role: storagedRole,
          token: storagedToken,
          type: storagedType,
        });
      }
    }
    console.log("effect!");
    loadStorageData();
    setLoading(false);
  }, []);

  async function logIn(email: string, password: string) {
    setLoading(true);
    try {
      const userLogged: any = await logInFirebase(email, password);
      console.log(userLogged ? userLogged.token : "error");
      if (!userLogged || !userLogged.id || !userLogged.token) {
        setError("authenticationError");
        return;
      } else {
        const type =
          userLogged.id === process.env.REACT_APP_USER_ADMIN
            ? "admin"
            : "secretaire";

        setUser({ ...userLogged, type });
        localStorage.setItem("@Auth:userId", userLogged.id);
        localStorage.setItem("@Auth:userRole", userLogged.role);
        localStorage.setItem("@Auth:accessToken", userLogged.token);
        localStorage.setItem("@Auth:userType", type);
        return;
      }
    } catch (error) {
      console.log(error);
      setError(error);
      return;
    }
  }

  async function logOut() {
    setLoading(true);
    try {
      await logOut();
      localStorage.clear();
      setError("");
      setUser(null);
      setLoading(false);
      navigate("/");
    } catch (error) {
      return;
    }
  }

  async function saveImage(data: Blob, ref: string) {
    //await firebase.uploadImage(data, ref)
  }

  return (
    <AuthContext.Provider
      value={{
        logged: !!user,
        user,
        logIn,
        logOut,
        loading,
        setLoading,
        error,
        saveImage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}
export default AuthContext;
