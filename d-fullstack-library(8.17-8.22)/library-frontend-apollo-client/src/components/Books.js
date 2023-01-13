import { useLazyQuery, useQuery } from "@apollo/client"
import { useState } from "react"
import { GET_BOOKS } from "../queries"

const Books = (props) => {
  let result = useQuery(GET_BOOKS, {
    skip: !props.show,
  })
  const [getBooksByGenre, result2] = useLazyQuery(GET_BOOKS, {
    fetchPolicy: "no-cache",
  })
  const [isClicked, setIsClicked] = useState(false)

  if (!props.show) {
    return null
  }

  if (result.loading) return <>Loading...</>
  if (result2.loading) return <>Loading...</>

  const books = isClicked ? result2.data.allBooks : result.data.allBooks
  // const genres = books.reduce((arr, current) => {
  //   if (current.genres.length > 0) {
  //     return [...arr, ...current.genres]
  //   } else {
  //     return arr
  //   }
  // }, [])
  const genreSet = new Set()
  result.data.allBooks.map((book) => {
    //or just books for dynamic buttons
    book.genres.forEach((genre) => {
      genreSet.add(genre)
    })
  })
  const genres = Array.from(genreSet).sort()
  console.log(genres)

  const onClick = (event) => {
    console.log(event.target.value)
    setIsClicked(true)
    getBooksByGenre({ variables: { genre: event.target.value } })
    // result = result2
    console.log("OnClick result", result2)
  }

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {genres.map((genre, index) => (
        <button key={index} onClick={onClick} value={genre}>
          {genre}
        </button>
      ))}
      <button onClick={() => setIsClicked(false)}>All Genres</button>
    </div>
  )
}

export default Books
