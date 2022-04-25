module.exports = {
  client: {
    includes: ['./src/**/*.graphql'],
    service: {
      name: 'dodao-service',
      localSchemaFile: './schema.graphql'
    }
  }
};
