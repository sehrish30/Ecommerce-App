const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

// app
const app = express();

// connect to mongoose
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
  })
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => console.log(`DB connection Err`, err));

// middlewares
app.use(morgan("dev"));

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// routes
app.get("/api", (req, res) => {
  res.json({
    data: "hey you hit node API",
  });
});

// port
const port = process.env.PORT || 80000;

// port as argument and listens on that port
app.listen(port, () => console.log(`Server is running on port ${port}`));
