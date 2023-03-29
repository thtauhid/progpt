const express = require("express");
const app = express();
const morgan = require("morgan");

require("dotenv").config();

app.use(morgan("dev"));
app.use(express.json());
// set up the view engine
app.set("view engine", "ejs");

app.get("/", async (req, res) => {
  try {
    res.render("index");
  } catch (error) {
    console.log(error);
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
