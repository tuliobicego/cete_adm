import React from "react";
import { Route, Routes } from "react-router-dom";
import LogIn from "../pages/logIn/logIn";
import { useAuth } from "../api/services/firebase/auth";
import { ApolloProvider } from "@apollo/client";
import client from "../api/services/apollo/client";
import AdminRoutes from "./admin";
import SecretarieRoutes from "./secretarie";
import AlumnRoutes from "./alumn";

const AppRoutes: React.FC = () => {
  const { logged, user } = useAuth();

  if (logged) {
    return (
      <ApolloProvider client={client}>
        {user?.role === 'adm' && <AdminRoutes />}
        {user?.role === 'secretarie' && <SecretarieRoutes />}
        {user?.role === 'alumn' && <AlumnRoutes />}
      </ApolloProvider>
    );
  } else return <Routes><Route path="/" element={<LogIn/>}/></Routes>;
};

export default AppRoutes;
