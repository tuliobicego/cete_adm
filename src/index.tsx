import React, { useRef, useEffect } from "react"; 
import { BrowserRouter } from "react-router-dom";
import Board from "./components/templates/Board";
import { AuthProvider } from "./api/services/firebase/auth";
import AppRoutes from "./routes";
import GlobalStyle from "./globalStyle";
import client from "./api/services/apollo/client";
import { ApolloProvider } from "@apollo/client";
import ReactDOM from "react-dom/client";
import "./index.css"

const App: React.FC = () => {
  
  const appRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (appRef.current) {
      console.log("Aplicação montada", appRef.current);
    }
  }, []);

  return (
    <div ref={appRef}>
      <BrowserRouter>
        <AuthProvider>
          <ApolloProvider client={client}>
            <Board>
              <AppRoutes />
              <GlobalStyle />
            </Board>  
          </ApolloProvider>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
};

// 🔹 Configuração correta do React 18+
const rootElement = document.getElementById("root");
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

export default App;
