const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const fs = require('fs');



//-----------set up express-----------
const app = express();
const PORT = process.env.PORT || 5050;
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.get("/", async (req, res) => {
/*  res.writeHead(200, {
    'Content-Type': 'text/html',
    'Access-Control-Allow-Origin': 'http://localhost:5000'
  });
  var readStream = fs.createReadStream(__dirname + '/test.html','utf8'); 
  readStream.pipe(res);
*/
  res.sendFile(path.join(__dirname + '/test.html'));
});


app.listen({ port: PORT }, () => console.log(`🚀 Server ready at http://localhost:5050`));
