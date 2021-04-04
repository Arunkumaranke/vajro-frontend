import {
    HttpLink,
    InMemoryCache,
    ApolloClient,
    ApolloLink,
  } from "apollo-boost";
  
  import config from "../config";
  
  const httpLink = new HttpLink({ uri: config.graphql });
  
  const ApolloGQLClient = new ApolloClient({
    link: ApolloLink.from([httpLink]),
    cache: new InMemoryCache(),
    connectToDevTools: true,
  });
  
  export default ApolloGQLClient;
  