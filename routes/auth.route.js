const express = require("express");
const bcrypt = require("bcrypt");

const auth = require("../middleware/auth");
const { User, validate } = require("../models/user.model");

const router = express.Router();


router.put('/', async (req, res) => {
  if (!req.body) res.sendStatus(400);

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ name: req.body.name });

  if (!user) return res.status(404).send("User wasn't registered.");

  bcrypt.compare(req.body.password, user.password, (err, result) => {
    if (!result) res.sendStatus(401).send('Incorrect password');

    const token = user.generateAuthToken();

    user.isOnline = true;
    user.save();

    res.cookie('4th_t', token, { maxAge: 28800000 }); //8 hour
    return res.send({
      _id: user._id,
      name: user.name,
    });
  });
});

router.delete('/logout', auth, async (req, res) => {
  const user = await User.findById(req.user._id);

  user.isOnline = false;
  await user.save();

  res.clearCookie('4th_t');
  res.sendStatus(200);
});

module.exports = router;