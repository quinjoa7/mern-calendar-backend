/*
  User routes / Auth
  host + /api/auth
*/

const { Router } = require("express");
const { check } = require("express-validator");
const router = Router();

const { createUser, loginUser, renewToken } = require("../controllers/auth");
const { fieldValidators } = require("../middlewares/fields-validators");
const { jwtValidator } = require("../middlewares/jwt-validator");

router.get("/renew", jwtValidator, renewToken);

router.post(
  "/",
  [
    //middlewares
    check("email", "Email is obligatory").isEmail(),
    check("password", "Password should have 6 characters").isLength({ min: 6 }),
    fieldValidators,
  ],
  loginUser
);

router.post(
  "/new",
  [
    //middlewares
    check("name", "Name is obligatory").not().isEmpty(),
    check("email", "Email is obligatory").isEmail(),
    check("password", "Password should have 6 characters").isLength({ min: 6 }),
    fieldValidators,
  ],
  createUser
);

module.exports = router;
