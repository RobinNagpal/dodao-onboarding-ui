import {
  ApolloClient,
  createHttpLink,
  InMemoryCache
} from '@apollo/client/core';
import gql from 'graphql-tag';

// HTTP connection to the API
const httpLink = createHttpLink({
  // You should use an absolute URL here
  uri: `${import.meta.env.VITE_HUB_URL}/graphql`
});

// Create the apollo client
export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache({
    addTypename: false
  }),
  defaultOptions: {
    query: {
      fetchPolicy: 'no-cache'
    }
  },
  typeDefs: gql`
    enum OrderDirection {
      asc
      desc
    }
  `
});
