import { useQuery } from "@apollo/client"
import { GET_BOOKS } from "../queries"

const Books = (props) => {
  const result = useQuery(GET_BOOKS, {
    skip: !props.show,
  })

  if (!props.show) {
    return null
  }

  if (result.loading) return <>Loading...</>

  const books = result.data.allBooks

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
              <td>{a.author}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Books
