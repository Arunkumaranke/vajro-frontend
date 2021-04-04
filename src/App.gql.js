import React from "react";
import { ApolloProvider } from "react-apollo";
import apolloClient from "./graphql";

const AppGQLClient = (props) => {
  return (
    <ApolloProvider client={apolloClient}>{props.children}</ApolloProvider>
  );
};

export default AppGQLClient;
