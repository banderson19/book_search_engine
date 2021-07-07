const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]
  }

  type Book {
    _id: ID
    authors: String
    description: String
    bookId: String
    image: String
    link: String
    title: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    me: User
    users: [User]
    user(username: String!): User
    books(title: String): [Book]
    book(bookID: ID!): Book
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(author: String!, description: String!, title: String! bookId: String!, image: String!, link: String!): User
    removeBook(bookId: String!): User
  }
  
`;

module.exports = typeDefs;
// type Mutation {
//     login(email: String!, password: String!): Auth
//     addUser(username: String!, email: String!, password: String!): Auth
//     addThought(thoughtText: String!): Thought
//     addReaction(thoughtId: ID!, reactionBody: String!): Thought
//     addFriend(friendId: ID!): User
//   }