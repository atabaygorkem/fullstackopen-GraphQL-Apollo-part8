import { useQuery } from "@apollo/client"
import { GET_AUTHORS } from "../queries"
import AuthorYearForm from "./AuthorYearForm"

const Authors = (props) => {
  const result = useQuery(GET_AUTHORS, {
    skip: !props.show,
  })

  if (!props.show) {
    return null
  }

  if (result.loading) return <>Loading...</>

  const authors = result.data.allAuthors

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <AuthorYearForm
        authors={authors}
        setErrorMessage={props.setErrorMessage}
      />
    </div>
  )
}

export default Authors
