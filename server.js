const express = require('express');
const app = express();
app.use(express.json());

const mongoose = require('mongoose');
const routes = require('./routes/routes');

const db = require("./config/keys").mongoURI;

mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB successfully connected"))
  .catch((err) => console.log(err));

app.get('/', (req, res) => {
    // res.status(200).json({success: true, msg: "Connected"});
    res.send({body: 'hello'})
});


app.use("/api", routes);

app.listen(3000);