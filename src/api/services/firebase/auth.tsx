import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { Firebase } from "./setup";
import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
export const auth = getAuth(Firebase);
  
  
  
  
export const logInFirebase = async (email: string, password: string) => {
  try {
    const authUser = await signInWithEmailAndPassword(auth, email, password);
    
    const user: any = authUser.user.toJSON();
    
    return { id: user.uid, token: user.stsTokenManager.accessToken };
  } catch (error: any) {
    console.log(JSON.stringify(error, null, 2));
  }
};

export const logOut = async () => {
    await signOut(auth);
};

interface User {
  id: string;
  role?: string;
  email: string
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
  setRole(role: string): void;
  loading: boolean;
  error: AuthError;
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
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      
      if (user && user.uid && user.email && user.uid === auth.currentUser?.uid && user.email === auth.currentUser?.email) {
        
        const role = sessionStorage.getItem("@Auth:userRole") || "";
        //const firebaseUid = sessionStorage.getItem("@Auth:userFirebaseUid") || "";
        //const email = sessionStorage.getItem("@Auth:userEmail") || "";
        

        setUser({ id: user.uid, email: user.email, role})

      } else {
        console.warn("Usuário deslogado ou token expirado, redirecionando...");
        setUser(null);
        sessionStorage.clear();
        navigate("/"); // 🔹 Redireciona automaticamente para o login
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  async function setRole(role: string) {
    const id = user?.id
    const email = user?.email
    if(id && email && role) setUser({id, email, role})
  }

  async function logIn(email: string, password: string): Promise<boolean> {
    setLoading(true);
    try {
      const authUser = await signInWithEmailAndPassword(auth, email, password);
      
      if(!authUser.user.uid) return false
      
      const id = authUser.user.uid 
      const emailLogged = authUser.user.email || ""
      //const role = authUser.user.email || ""

      setUser({ id: id, role: '', email: emailLogged})

      sessionStorage.setItem("@Auth:userEmail", emailLogged);
      sessionStorage.setItem("@Auth:userFirebaseUid", id);
      
      return true;
    } catch (error: any) {
      setError({message: "authFailure"}); 
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function logOut() {
    setLoading(true);
    try {
      await signOut(auth);
      sessionStorage.clear();
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("logOutError:", JSON.stringify(error, null, 2));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        logged: !!user?.email && !!user?.id && !!user?.role,
        user,
        logIn,
        logOut,
        loading,
        setLoading,
        error,
        setRole,
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
