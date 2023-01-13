import { useApolloClient, useQuery } from "@apollo/client"
import { useState } from "react"
import Authors from "./components/Authors"
import Books from "./components/Books"
import LoginForm from "./components/LoginForm"
import NewBook from "./components/NewBook"
import { GET_AUTHORS } from "./queries"

const App = () => {
  const [page, setPage] = useState("authors")
  const [errorMessage, setErrorMessage] = useState(null)
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  const setError = (message) => {
    setErrorMessage(message)
    setTimeout(() => setErrorMessage(null), 6000)
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    setPage("authors")
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {token && <button onClick={() => setPage("add")}>add book</button>}
        {!token && <button onClick={() => setPage("login")}>login</button>}
        {token && <button onClick={logout}>Log out</button>}
      </div>

      {errorMessage && <>{errorMessage}</>}

      <Authors setErrorMessage={setError} show={page === "authors"} />

      <Books show={page === "books"} />

      <NewBook setErrorMessage={setError} show={page === "add"} />

      <LoginForm
        setToken={setToken}
        setError={setError}
        setPage={setPage}
        show={page === "login"}
      />
    </div>
  )
}

export default App
