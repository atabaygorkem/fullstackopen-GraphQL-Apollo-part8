import mongoose from "mongoose"
import { configUtil } from "./config"

export default function connectToMongo() {
  console.log("Connecting to", configUtil.MONGODB_URI)
  mongoose.set("strictQuery", false)
  mongoose
    .connect(configUtil.MONGODB_URI)
    .then(() => {
      console.log("Connected to MongoDB")
    })
    .catch((error) => {
      console.log("Error connection to MongoDB:", error.message)
    })
}
