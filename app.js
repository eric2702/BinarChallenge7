const express = require('express');
const mongoose = require('mongoose');
const app = express();

const authRouter = require('./routes/auth')
const roomRouter = require('./routes/room')

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(authRouter)
app.use(roomRouter)

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
  });

mongoose
  .connect(
    'mongodb://localhost:27017/binar_ch7', {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false, 
        useCreateIndex: true
    })
  .then(() => {
    app.listen(3000);
    console.log("RUNNING")
  })
  .catch(err => console.log(err));