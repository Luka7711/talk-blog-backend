const mongoose = require("mongoose");
require("dotenv").config();

const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vetj9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

mongoose
  .connect(url)
  .then(() => console.log("mongoose connected"))
  .catch((err) => console.log(err, "server disconnected"));
