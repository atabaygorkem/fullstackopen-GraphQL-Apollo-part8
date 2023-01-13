import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from "@apollo/server/standalone"
import { books as importedBooks, authors as importedAuthors } from "./db.js"
import { v4 as uuid } from "uuid"

let books = importedBooks
let authors = importedAuthors
// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = `#graphql
  # This "Book" type defines the queryable fields for every book in our data source.

  type Book {
    title: String!
    published: Int
    author: String!
    id: ID!
    genres: [String]
  }

  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int!
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).

  type Query {
    #books: [Book]
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book]
    allAuthors: [Author]
  }

  type Mutation {
    addBook(title: String, author: String, published: Int, genres: [String]) : Book
    editAuthor(name: String!, setBornTo: Int!): Author
  }
`

// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    bookCount: () => books.length,
    authorCount: () => authors.length,
    allBooks: (root, args) => {
      let tempBooks = books

      if (args.author) {
        tempBooks = tempBooks.filter((book) => book.author === args.author)
      }
      if (args.genre) {
        tempBooks = tempBooks.filter((book) => book.genres.includes(args.genre))
      }
      return tempBooks
    },
    allAuthors: () => {
      return authors
    },
  },
  Mutation: {
    addBook: (root, args) => {
      let book = { ...args, id: uuid() }
      books = [...books, book]

      let isAuthorExist = authors.filter(
        (author) => author.name === args.author
      )
      console.log(isAuthorExist.length === 0)
      if (isAuthorExist.length === 0) {
        console.log("create author")
        const author = {
          name: args.author,
          id: uuid(),
        }
        authors = authors.concat(author)
      }
      console.log(authors)
      return book
    },
    editAuthor: (root, args) => {
      const authorObj = authors.find((author) => author.name === args.name)
      if (!authorObj) return null
      const updatedAuthor = { ...authorObj, born: args.setBornTo }
      authors = authors.map((author) =>
        author.name === args.name ? updatedAuthor : author
      )
      return updatedAuthor
    },
  },
  Author: {
    bookCount: ({ name }) => {
      return books.filter((book) => book.author === name).length
    },
  },
}

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
})

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
})

console.log(`🚀  Server ready at: ${url}`)
