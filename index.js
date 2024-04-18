// This is the Web Server
const express = require("express");
const server = express();

// enable cross-origin resource sharing to proxy api requests
// from localhost:3000 to localhost:4000 in local dev env
const cors = require("cors");
server.use(cors());

// create logs for everything
const morgan = require("morgan");
server.use(morgan("dev"));

// handle application/json requests
server.use(express.json());

// here's our static files

// here's our API
server.use("/api", require("./api"));

// bring in the DB connection
const client = require("./db/client");

// connect to the server
const PORT = process.env.PORT || 8080;

//GET//

//- returns homepage
server.get("/", (req, res) => {
  //serve up the public folder as static index.html file
  res.sendFile(__dirname + "/public/index.html");
});

// define a server handle to close open tcp connection after unit tests have run
server.listen(PORT, async () => {
  console.log(`Server is running on ${PORT}!`);
});
