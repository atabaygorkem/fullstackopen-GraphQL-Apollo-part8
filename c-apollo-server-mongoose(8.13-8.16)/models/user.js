import mongoose from "mongoose"

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
  },
  favouriteGenre: {
    type: String,
  },
  // friends: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "Person",
  //   },
  // ],
})

const User = mongoose.model("User", schema)
export default User
