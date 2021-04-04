let config = {};

const NODE_ENV = process.env.NODE_ENV;

if (NODE_ENV === "production") {
  config.url = process.env.REACT_APP_PROD_ENDPOINT;
  config.api_url = process.env.REACT_APP_PROD_API_ENDPOINT;
  config.graphql = process.env.REACT_APP_PROD_GQL_ENDPOINT;
} else if (NODE_ENV === "development") {
  config.url = process.env.REACT_APP_DEV_ENDPOINT;
  config.api_url = process.env.REACT_APP_DEV_API_ENDPOINT;
  config.graphql = process.env.REACT_APP_DEV_GQL_ENDPOINT;
} else {
  config.api_url = process.env.REACT_APP_LOCAL_API_ENDPOINT;
  config.graphql = process.env.REACT_APP_LOCAL_GQL_ENDPOINT;
}

export default config;
