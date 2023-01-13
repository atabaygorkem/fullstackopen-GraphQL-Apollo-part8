import { gql } from "@apollo/client"

export const GET_AUTHORS = gql`
  query GetAuthors {
    allAuthors {
      bookCount
      born
      id
      name
    }
  }
`

export const GET_BOOKS = gql`
  query GetBooks($author: String, $genre: String) {
    allBooks(author: $author, genre: $genre) {
      author {
        bookCount
        born
        id
        name
      }
      genres
      id
      published
      title
    }
  }
`

export const ADD_BOOK = gql`
  mutation AddBook(
    $title: String!
    $author: String!
    $published: Int!
    $genres: [String!]!
  ) {
    addBook(
      title: $title
      author: $author
      published: $published
      genres: $genres
    ) {
      author {
        bookCount
        born
        id
        name
      }
      genres
      id
      published
      title
    }
  }
`

export const EDIT_AUTHOR = gql`
  mutation EditAuthor($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      bookCount
      born
      id
      name
    }
  }
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`
