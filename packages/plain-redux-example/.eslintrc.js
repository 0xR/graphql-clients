module.exports = {
  "parser": "babel-eslint",
  "extends": "react-app",
  plugins: ['graphql'],
  "rules": {
    "graphql/template-strings": ['error', {
      // Import default settings for your GraphQL client. Supported values:
      // 'apollo', 'relay', 'lokka'
      env: 'lokka',

      // Import your schema JSON here
      schemaJson: require('./data/schema.json'),

      // OR provide absolute path to your schema JSON
      // schemaJsonFilepath: path.resolve(__dirname, './schema.json'),

      // Optional, the name of the template tag, defaults to 'gql'
      tagName: 'gql'
    }]
  },
  globals: {
    gql: true
  }
}
