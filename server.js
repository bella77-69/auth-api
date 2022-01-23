const express = require('express');
const app = express();
const mongoose = require('mongoose');


const db = require("./config/keys").mongoURI;

mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("MongoDB successfully connected"))
  .catch((err) => console.log(err));

app.get('/', (req, res) => {
    res.status(200).json({success: true, msg: "Connected"});
});

app.listen(3000);