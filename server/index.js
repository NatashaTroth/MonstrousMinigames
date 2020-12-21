const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");


//-----------set up express-----------
const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
  res.send("GAAMMEE")
});

// app.post("/", async (req, res) => {

// });


app.listen({ port: PORT }, () => console.log(`🚀 Server ready at http://localhost:5000`));
