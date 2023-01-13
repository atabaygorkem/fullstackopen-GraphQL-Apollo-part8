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
  query GetBooks {
    allBooks {
      author
      genres
      id
      published
      title
    }
  }
`

export const ADD_BOOK = gql`
  mutation AddBook(
    $title: String
    $author: String
    $published: Int
    $genres: [String]
  ) {
    addBook(
      title: $title
      author: $author
      published: $published
      genres: $genres
    ) {
      author
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
