import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from "@apollo/server/standalone"
import { books as importedBooks, authors as importedAuthors } from "./db.js"
import { v4 as uuid } from "uuid"
import { configUtil } from "./utils/config.js"
import mongoose from "mongoose"
import Book from "./models/book.js"
import Author from "./models/author.js"
import User from "./models/user.js"
import jwt from "jsonwebtoken"
import { GraphQLError } from "graphql"
const { sign: jwtSign, verify: jwtVerify } = jwt

mongoose.set("strictQuery", false)
mongoose
  .connect(configUtil.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB")
  })
  .catch((error) => {
    console.log("Error connection to MongoDB:", error.message)
  })
// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = `#graphql
  # This "Book" type defines the queryable fields for every book in our data source.

  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }

  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int
  }

  type User {
    username: String!
    favouriteGenre: String!
    id: ID!
  }
  
  type Token {
    value: String!
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
    me: User
  }

  type Mutation {
    addBook(title: String!, author: String!, published: Int!, genres: [String!]!) : Book
    editAuthor(name: String!, setBornTo: Int!): Author
    createUser(
      username: String!
      favouriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }
`

// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    bookCount: async () => await Book.countDocuments(),
    authorCount: async () => await Author.countDocuments(),
    allBooks: async (root, args) => {
      let tempBooks = await Book.find().populate("author")

      if (args.author) {
        tempBooks = tempBooks.filter((book) => book.author.name === args.author)
      }
      if (args.genre) {
        tempBooks = tempBooks.filter((book) => book.genres.includes(args.genre))
      }
      return tempBooks
    },
    allAuthors: async () => await Author.find(),
    me: (root, args, context) => context.currentUser,
  },
  Mutation: {
    addBook: async (root, args, contextValue) => {
      if (!contextValue.currentUser) {
        throw new GraphQLError(
          "You are not authorized to perform this action.",
          {
            extensions: {
              code: "FORBIDDEN",
            },
          }
        )
      }
      let author = await Author.findOne({ name: args.author }) //We can use findOne to return object instead of find that returns array
      console.log("author", author)
      if (!author) {
        author = new Author({ name: args.author, born: null })
        await author.save()
      }
      console.log("newAuthor", author)
      const book = new Book({ ...args, author: author._id })
      // const book = new Book({ ...args, author })

      book.save()
      console.log("Book: ", await book.populate("author"))
      return book.populate("author")

      // let isAuthorExist = authors.filter(
      //   (author) => author.name === args.author
      // )
      // console.log(isAuthorExist.length === 0)
      // if (isAuthorExist.length === 0) {
      //   console.log("cs")
      //   const author = {
      //     name: args.author,
      //     id: uuid(),
      //   }
      //   authors = authors.concat(author)
      // }
      // console.log(authors)
    },
    editAuthor: async (root, args, contextValue) => {
      if (!contextValue.currentUser) {
        throw new GraphQLError(
          "You are not authorized to perform this action.",
          {
            extensions: {
              code: "FORBIDDEN",
            },
          }
        )
      }
      const author = await Author.findOne({ name: args.name })
      if (!author) return null
      console.log("Edit author: ", author)
      author.born = args.setBornTo
      return author.save()
      // const authorObj = authors.find((author) => author.name === args.name)
      // if (!authorObj) return null
      // const updatedAuthor = { ...authorObj, born: args.setBornTo }
      // authors = authors.map((author) =>
      //   author.name === args.name ? updatedAuthor : author
      // )
      // return updatedAuthor
    },
    createUser: async (root, args) => {
      const user = new User({ ...args })
      return user.save()
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== "secret") {
        throw new UserInputError("wrong credentials")
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwtSign(userForToken, configUtil.SECRET_KEY) }
    },
  },
  Author: {
    bookCount: async ({ name }) => {
      const books = await Book.find().populate("author")
      return books.filter((book) => book.author.name === name).length
      // return books.filter((book) => book.author === name).length
    },
  },
  // Book: {
  //   author: async (root) => {
  //     const author = await Author.find({ name: root.author })
  //     return author
  //   },
  // },
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
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    console.log("Auth: ", auth)
    if (auth && auth.toLowerCase().startsWith("bearer ")) {
      const decodedToken = jwtVerify(auth.substring(7), configUtil.SECRET_KEY)
      const currentUser = await User.findById(decodedToken.id)
      console.log("Auth: ", auth)
      console.log("Verify: ", currentUser)
      return { currentUser }
    }
  },
})

console.log(`🚀  Server ready at: ${url}`)
