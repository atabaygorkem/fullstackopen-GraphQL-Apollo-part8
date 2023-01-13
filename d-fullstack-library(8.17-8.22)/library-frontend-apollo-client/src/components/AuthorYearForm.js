import { useMutation } from "@apollo/client"
import { useState } from "react"
import { EDIT_AUTHOR, GET_AUTHORS } from "../queries"
import Select from "react-select"

const AuthorYearForm = (props) => {
  // const [name, setName] = useState("")
  const [birthYear, setBirthYear] = useState("")
  const [selectedOption, setSelectedOption] = useState(null)

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: GET_AUTHORS }],
    onError: (err) => {
      props.setErrorMessage(err.graphQLErrors[0].message)
    },
  })
  // console.log("Props.authors before options: ", props.authors)
  const options = props.authors.map((author) => ({
    ...author,
    value: author.name,
    label: author.name,
  }))
  // console.log("After options: ", options)

  const handleSubmit = (e) => {
    e.preventDefault()

    editAuthor({
      variables: { name: selectedOption.name, setBornTo: +birthYear },
    })
    // setName("")
    setBirthYear("")
  }

  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption)
    // setName(selectedOption.value)
    console.log(selectedOption)
  }
  return (
    <>
      <h1>Set Birthyear</h1>
      <Select
        options={options}
        value={selectedOption}
        onChange={handleChange}
      />
      <form onSubmit={handleSubmit}>
        {/* <div>
          Name: 
          <input
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </div> */}
        <div>
          Born:
          <input
            value={birthYear}
            onChange={({ target }) => setBirthYear(target.value)}
          />
        </div>
        <button type="submit">Update author</button>
      </form>
    </>
  )
}

export default AuthorYearForm
