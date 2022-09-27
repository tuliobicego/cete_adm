import React from "react";
import { BrowserRouter, Routes } from "react-router-dom";
import Board from "./components/templates/Board";
import { AuthProvider } from "./api/services/firebase/auth";
import AppRoutes from "./routes";
import GlobalStyle from "./globalStyle";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Board>
        <AuthProvider>
          <AppRoutes />
          <GlobalStyle />
        </AuthProvider>
      </Board>
    </BrowserRouter>
  );
};

export default App;