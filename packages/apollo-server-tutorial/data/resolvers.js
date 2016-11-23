import { Author, Post, View, FortuneCookie } from './connectors';

function addGlobalId(type) {
  return (instance) => {
    instance.id = type + instance.id;
  }
}

const resolveFunctions = {
  RootQuery: {
    author(_, { firstName, lastName }){
      let where = { firstName, lastName};
      if (!lastName){
        where = { firstName };
      }
      if (!firstName){
        where = { lastName };
      }
      return Author.find({ where });
    },
    fortuneCookie(){
      return FortuneCookie.getOne();
    },
    authors(_, { limit, offset }) {
      return Author.findAll({ limit, offset });
    },
    relayAuthors(_, { limit, offset }) {
      return Author.findAll({ limit, offset });
    },
    node(_, { id }, info) {
      const [type, dbid] = id.split(';');
      if(type === 'author') {
        return Author.findById(dbid).then(a => {console.log(a.id); return a});
      } else if (type === 'post') {
        return Post.findById(dbid);
      }
    }
  },
  RootMutation: {
    createAuthor: (root, args) => { return Author.create(args); },
    createPost: (root, { authorId, tags, title, text }) => {
      return Author.findOne({ where: { id: authorId } }).then( (author) => {
        return author.createPost( { tags: tags.join(','), title, text });
      });
    },
  },
  Author: {
    posts(author, args){
      return author.getPosts(args);
    },
  },
  Post: {
    author(post){
      return post.getAuthor();
    },
    tags(post){
      return post.tags.split(',');
    },
    views(post){
      return new Promise((resolve, reject) => {
        setTimeout( () => reject('MongoDB timeout when fetching field views (timeout is 500ms)'), 500);
        View.findOne({ postId: post.id }).then( (res) => resolve(res.views) );
      })
    }
  },
  AuthorResult: {
    authors(authors, args) {
      return authors;
    }
  },
  Node: {
    __resolveType(root, context, info) {
      if (root.Model.name === 'author') {
         return info.schema.getType('Author');
      } else if (root.Model.name === 'post') {
         return info.schema.getType('Post');
      }
    }
  }
}

export default resolveFunctions;
