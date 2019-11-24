const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');

const usersRoute = require("./routes/user.route");
const authRouter = require('./routes/auth.route');

const port = process.env.PORT || 3000;
const config = require("config");

const app = express();


//use config module to get the privatekey, if no private key set, end the application
app.use(cookieParser());

app.use(express.urlencoded({ extended: false }))
app.use(express.json());
//use users route for api/users
app.use("/api/users", usersRoute);
app.use("/api/auth", authRouter);
//connect to mongodb
mongoose
  .connect("mongodb://localhost/nodejsauth", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to MongoDB...")
    if (!config.get("myprivatekey")) {
      console.error("FATAL ERROR: myprivatekey is not defined.");
      process.exit(1);
    }
    app.listen(port, () => console.log(`Listening on port ${port}...`));
  })
  .catch(err => console.error("Could not connect to MongoDB..."));


