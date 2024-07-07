const bodyParser = require("body-parser");
const express = require("express");
const app = express();


const userRouter = require('../routers/user.js');
const organisationRouter = require('../routers/organisation.js')
const PORT = process.env.PORT || 3000;



app.use(express.json())
app.use(userRouter);
app.use(organisationRouter);

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`)
})

module.exports = app;

