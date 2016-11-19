const typeDefinitions = `
type Author {
  id: String! # the ! means that every author object _must_ have an id
  firstName: String
  lastName: String
  posts(offset: Int, limit: Int): [Post]
}

type Post {
  id: String!
  tags: [String]
  title: String
  text: String
  views: Int
  author: Author
}

# the schema allows the following two queries:
type RootQuery {
  author(firstName: String, lastName: String): Author
  authors(offset: Int, limit: Int): [Author]
  relayAuthors(offset: Int, limit: Int): AuthorResult
  fortuneCookie: String
}

type AuthorResult {
  authors: [Author]
}

# this schema allows the following two mutations:
type RootMutation {
  createAuthor(
    firstName: String!
    lastName: String!
  ): Author

  createPost(
    tags: [String!]!
    title: String!
    text: String!
    authorId: String!
  ): Post
}

# we need to tell the server which types represent the root query
# and root mutation types. We call them RootQuery and RootMutation by convention.
schema {
  query: RootQuery
  mutation: RootMutation
}
`;

export default [typeDefinitions];
