import fs from 'fs';
import path from 'path';
import Schema from 'apollo-server-tutorial/data/schema';
import { graphql }  from 'graphql';
import { introspectionQuery, printSchema, buildSchema } from 'graphql/utilities';

// Save JSON of full schema introspection for Babel Relay Plugin to use
(async () => {
  var result = await (graphql(buildSchema(Schema[0]), introspectionQuery));
  if (result.errors) {
    console.error(
      'ERROR introspecting schema: ',
      JSON.stringify(result.errors, null, 2)
    );
  } else {
    fs.writeFileSync(
      path.join('data/schema.json'),
      JSON.stringify(result, null, 2)
    );
  }
})();

// Save user readable type system shorthand of schema
fs.writeFileSync(
  path.join('data/schema.graphql'),
  Schema[0]
);
