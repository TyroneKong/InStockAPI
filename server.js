const express = require("express");
const app = express();
const fs = require("fs");
const cors = require("cors");
const PORT = 8080;

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  console.log("incoming request");
  next();
});

app.get("/", (req, res) => {
  console.log("welcome to instock server");
  res.send("You are on instock server");
});

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`listening on port ${PORT}`);
  }
});
