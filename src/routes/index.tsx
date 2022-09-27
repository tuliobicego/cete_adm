import React from "react";
import { Route, Routes } from "react-router-dom";
import LogIn from "../pages/logIn/logIn";
import { useAuth } from "../api/services/firebase/auth";
import Loading from "../components/atoms/Loading";
import { ApolloProvider } from "@apollo/client";
import client from "../api/services/apollo/client";
import InternRoutes from "./intern";
import AdminRoutes from "./admin";
import SupervisorRoutes from "./supervisor";
import UndergradRoutes from "./undergrad";

const AppRoutes: React.FC = () => {
  const { logged, loading, user, error } = useAuth();
  console.log({ logged, loading, user, error });

  if (loading) return <Loading />;
  if (logged) {
    return (
      <ApolloProvider client={client}>
        {user?.id === process.env.REACT_APP_USER_ADMIN && <AdminRoutes />}
        {user?.role === 'supervisor' && <SupervisorRoutes />}
        {user?.role === 'undergrad' && <UndergradRoutes />}
        {user?.role === 'intern' && <InternRoutes />}
      </ApolloProvider>
    );
  } else return <Routes><Route path="/" element={<LogIn/>}/></Routes>;
};

export default AppRoutes;
