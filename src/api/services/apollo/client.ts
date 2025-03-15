import {
    ApolloClient,
    InMemoryCache,
    NormalizedCacheObject,
    createHttpLink,
    ApolloLink,
    Observable,
  } from "@apollo/client";
import { getAuth, /*signOut*/ } from "firebase/auth";
import { Firebase } from "../firebase/setup";
//import { onError } from "@apollo/client/link/error";
//import { useNavigate } from "react-router";

  const httpLink = createHttpLink({
    uri:
    process.env.REACT_APP_NODE_ENV === "production"
      ? `${process.env.REACT_APP_BACKEND_URL}graphql`
      : "http://localhost:3333/graphql",
      headers: {'keep-alive': 'true'}});
  
  const getFirebaseToken = async (): Promise<string | null> => {
    const auth = getAuth(Firebase);
    const user = auth.currentUser;
    if (user) {
      return await user.getIdToken();
    }
    return null;
  };

  const uploadMiddleware = new ApolloLink((operation, forward) => {
    return new Observable((observer) => {
      getFirebaseToken()
        .then((token) => {
          const headers = { authorization: token ? `Bearer ${token}` : "" };
          const { variables, operationName } = operation;
          const isUpload =
            variables &&
            Object.values(variables).some(
              (value) => value instanceof File || value instanceof Blob
            );
  
          if (isUpload) {
            //console.log("📂 Upload detectado! Enviando como multipart/form-data.");
  
            const formData = new FormData();
            const fileMap: Record<string, string[]> = {};
            const processedVariables = { ...variables };
            let fileIndex = 0;
  
            // 🔹 Primeiro preparamos o fileMap e ajustamos as variáveis
            Object.entries(variables).forEach(([key, value]) => {
              if (value instanceof File || value instanceof Blob) {
                fileMap[fileIndex] = [`variables.${key}`];
                processedVariables[key] = null;
                fileIndex++;
              } else if (Array.isArray(value) && value.some((v) => v instanceof File || v instanceof Blob)) {
                processedVariables[key] = value.map((file, idx) => {
                  if (file instanceof File || file instanceof Blob) {
                    fileMap[fileIndex] = [`variables.${key}.${idx}`];
                    fileIndex++;
                    return null;
                  }
                  return file;
                });
              }
            });
  
            // 🔹 1. Adicionamos `operations` antes de `map`
            formData.append(
              "operations",
              JSON.stringify({
                query: operation.query.loc?.source.body,
                variables: processedVariables,
              })
            );
  
            // 🔹 2. Depois adicionamos `map`
            formData.append("map", JSON.stringify(fileMap));
  
            // 🔹 3. Agora adicionamos os arquivos ao `FormData`
            fileIndex = 0;
            Object.entries(variables).forEach(([key, value]) => {
              if (value instanceof File || value instanceof Blob) {
                formData.append(String(fileIndex), value);
                fileIndex++;
              } else if (Array.isArray(value) && value.some((v) => v instanceof File || v instanceof Blob)) {
                value.forEach((file) => {
                  if (file instanceof File || file instanceof Blob) {
                    formData.append(String(fileIndex), file);
                    fileIndex++;
                  }
                });
              }
            });
  
            fetch(process.env.REACT_APP_NODE_ENV === "production"
              ? `${process.env.REACT_APP_BACKEND_URL}graphql`
              : "http://localhost:3333/graphql",
              {
                method: "POST",
                body: formData,
                headers: {
                  authorization: token ? `Bearer ${token}` : "",
                  "x-apollo-operation-name": operationName, // 🔹 Previne bloqueio de CSRF
                },
            })
              .then(async (response) => {
                const json = await response.json();
                //console.log("🔍 Resposta do servidor:", json);
                if (!response.ok) throw new Error(json);
                observer.next(json);
                observer.complete();
              })
              .catch((error) => observer.error(error));
  
            return () => {};
          }
  
          // 🔹 Caso **não** seja upload, segue com requisição normal no Apollo
          operation.setContext(({ headers: existingHeaders }) => ({
            headers: {
              ...existingHeaders,
              ...headers,
              "Content-Type": "application/json",
            },
          }));
  
          return forward(operation).subscribe({
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer),
          });
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  });

  const client = new ApolloClient<NormalizedCacheObject>({
    link: ApolloLink.from([ uploadMiddleware, httpLink]),
    cache: new InMemoryCache(),
  });

  export default client;

  /*const errorLink = onError(({ graphQLErrors, networkError }) => {
    const auth = getAuth(Firebase);
    const navigate = useNavigate();
  
    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        if (err.message === "notAuthorized") {
          //console.warn("Usuário não autorizado, forçando logout...");
          signOut(auth).then(() => {
            sessionStorage.clear();
            navigate("/"); // 🔹 Redireciona para o login
          });
        }

        if (err.message === "sessionExpired") {
          //console.warn("🛑 Sessão expirada, forçando logout...");
          signOut(auth).then(() => {
            sessionStorage.clear();
            navigate("/"); // 🔹 Redireciona para a tela de login
          });
        }
      }
    }
  
    if (networkError) {
      console.error(`[Erro de rede]:`, networkError);
    }
  });
  
  
  */
  
  // Middleware para incluir o token antes de cada requisição
  /*const authMiddleware = new ApolloLink((operation, forward) => {
    return new Observable(observer => {
      getFirebaseToken()
        .then(token => {
          if (token) {
            operation.setContext(({ headers = {} }) => ({
              headers: {
                ...headers,
                authorization: `Bearer ${token}`, // 🔹 Envia o token no cabeçalho
              },
            }));
          }
        })
        .finally(() => {
          // 🔹 Envia a requisição após modificar os cabeçalhos
          forward(operation).subscribe({
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer),
          });
        });
    });
  });*/

  /*const authMiddleware = new ApolloLink((operation, forward) => {
    return new Observable(observer => {
      getFirebaseToken()
        .then(token => {
          operation.setContext(({ headers = {} }) => ({
            headers: {
              ...headers,
              authorization: token ? `Bearer ${token}` : "", // 🔹 Garante que o token seja incluído
            },
          }));
        })
        .finally(() => {
          const subscriber = forward(operation).subscribe({
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer),
          });
  
          return () => {
            subscriber.unsubscribe();
          };
        })
        .catch(error => observer.error(error));
    });
  });*/

 /* const authMiddleware = new ApolloLink((operation, forward) => {
    return new Observable(observer => {
      getFirebaseToken()
        .then(token => {
          // 🔹 Verifica se a requisição contém um upload de arquivo
          const isUpload = Object.values(operation.variables || {}).some(
            value => value instanceof File || value instanceof Blob
          );
  
          if (isUpload) {
            console.log("📂 Upload detectado!");
  
            // 🔹 Criar um FormData para a requisição multipart
            const formData = new FormData();
            console.log({formDataCreated: formData});
  
            // 🔹 Adicionar as variáveis ao FormData
            Object.entries(operation.variables || {}).forEach(([key, value]) => {
              if (value instanceof File || value instanceof Blob) {
                formData.append(key, value); // 🔹 Adiciona arquivos corretamente
              } else {
                formData.append(key, JSON.stringify(value)); // 🔹 Adiciona outros dados como JSON
              }
            });
            console.log({formData: formData.get("file")});
            operation.setContext(({ headers = {} }) => ({
              headers: {
                ...headers,
                authorization: token ? `Bearer ${token}` : "", // 🔹 Inclui autenticação
              },
              body: formData,
            }));
            console.log({context: operation.getContext()});
          } else {
            console.log("📡 Requisição normal");
  
            operation.setContext(({ headers = {} }) => ({
              headers: {
                ...headers,
                authorization: token ? `Bearer ${token}` : "",
                "Content-Type": "application/json",
              },
            }));
          }
        })
        .then(() => {
          // 🔹 Executa a requisição após definir os headers corretamente
          const subscriber = forward(operation).subscribe({
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer),
          });
  
          return () => {
            subscriber.unsubscribe();
          };
        })
        .catch(error => observer.error(error));
    });
  });*/



  
  
  
  
  
  
  
  
  
  
  
  
  


  
  
  
  



  
/*
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri:
      process.env.REACT_APP_NODE_ENV === "production"
        ? `${process.env.REACT_APP_BACKEND_URL}graphql`
        : "http://localhost:3333/graphql"
  }),
  */


  