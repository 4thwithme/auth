const config = require("config");
const mongoose = require("mongoose");
const usersRoute = require("./routes/user.route");
const express = require("express");
const app = express();


const port = process.env.PORT || 3000;

//use config module to get the privatekey, if no private key set, end the application
app.use(express.urlencoded({ extended: false }))
app.use(express.json());
//use users route for api/users
app.use("/api/users", usersRoute);
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


