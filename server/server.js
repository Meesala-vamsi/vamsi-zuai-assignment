const mongoose = require("mongoose")
const app = require("./app")
const dotenv = require("dotenv")

dotenv.config({path:"./.env"})


mongoose.connect(process.env.CONN_STR,{
  useNewUrlParser:true
})
.then((conn)=>{
  console.log("Connected to database...")
})
.catch((err)=>{
  console.log(err.message)
})

const port = process.env.PORT || 3001

app.listen(port,()=>{
  console.log(`Server listening on port ` + port)
})