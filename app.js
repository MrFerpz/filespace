const express = require('express');
const app = express();

app.get("/", (req, res) => res.send("hello"));

console.log("Server live at localhost:3000!");
app.listen(3000);