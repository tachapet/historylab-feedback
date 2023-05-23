/**
 * Server of the application. Only basic logic.
 * Used: Express.js
 *
 * */

const express = require('express')
const app = express()
const port = 8888;
const cors = require("cors");
const store = require("store");
const serverState = "production";
const production = require("./server.production");

app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Load endpoints
require("./api")(app);

// Set dummy data
store.set('devata', [{
  studentName: "Petr Novák"
}, {
  studentName: "Pavel Svoboda"
}, {
  studentName: "Jitka Černá"
}]);
store.set('entryIds', []);


if (serverState === "production") {
  production(app);
}



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})