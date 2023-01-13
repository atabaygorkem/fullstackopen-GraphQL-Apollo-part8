import { useQuery } from "@apollo/client"
import { useState } from "react"
import Authors from "./components/Authors"
import Books from "./components/Books"
import NewBook from "./components/NewBook"
import { GET_AUTHORS } from "./queries"

const App = () => {
  const [page, setPage] = useState("authors")
  const [errorMessage, setErrorMessage] = useState(null)

  const setError = (message) => {
    setErrorMessage(message)
    setTimeout(() => setErrorMessage(null), 6000)
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        <button onClick={() => setPage("add")}>add book</button>
      </div>

      {errorMessage && <>{errorMessage}</>}

      <Authors setErrorMessage={setError} show={page === "authors"} />

      <Books show={page === "books"} />

      <NewBook setErrorMessage={setError} show={page === "add"} />
    </div>
  )
}

export default App
