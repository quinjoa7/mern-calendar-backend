const { response } = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { generateJWT } = require("../helpers/jwt");

const createUser = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    // searches user with this email
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).send({
        ok: false,
        msg: "Email already in use",
      });
    }

    user = new User(req.body);

    // Encrypt password
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    // Save user on DB
    await user.save();

    // Generate JWT
    const token = await generateJWT(user.id, user.name);

    res.status(201).send({
      ok: true,
      uid: user.id,
      name: user.name,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ ok: false });
  }
};

const loginUser = async (req, res = response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).send({
        ok: false,
        msg: "Incorrect email or password",
      });
    }
    // password validation
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).send({
        ok: false,
        msg: "Incorrect Password",
      });
    }
    // Generate JWT
    const token = await generateJWT(user.id, user.name);

    res.status(201).send({
      ok: true,
      uid: user.id,
      name: user.name,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ ok: false });
  }
};

const renewToken = async (req, res = response) => {
  const { uid, name } = req;

  // generate JWT
  const token = await generateJWT(uid, name);
  res.status(201).send({
    ok: true,
    uid,
    name,
    token,
  });
};

module.exports = {
  createUser,
  loginUser,
  renewToken,
};
