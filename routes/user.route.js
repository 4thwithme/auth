const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");
const { User, validate } = require("../models/user.model");
const express = require("express");
const router = express.Router();

router.get("/current", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

router.post("/create", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //find an existing user
  let user = await User.findOne({ name: req.body.name });
  if (user) return res.status(400).send("User already registered.");

  User.collection.insertOne({
    name: req.body.name,
    password: await bcrypt.hash(req.body.password, 10),
    isOnline: false,
  })
    .then(() => res.sendStatus(200));
});

module.exports = router;