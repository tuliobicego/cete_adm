import {
    ApolloClient,
    InMemoryCache,
    NormalizedCacheObject,
    HttpLink,
  } from "@apollo/client";
  
  const client = new ApolloClient<NormalizedCacheObject>({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri:
        process.env.REACT_APP_NODE_ENV === "production"
          ? `${process.env.REACT_APP_BACKEND_URL}graphql`
          : "http://localhost:3333/graphql",
      headers: {
        "Content-Type": "application/json",
      },
    }),
  });
  
  export default client;
  