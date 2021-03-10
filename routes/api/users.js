const express = require("express");
const router = express.Router();
const gravator = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { body, validationResult } = require("express-validator");

const User = require("../../models/User");
const Testing = require("../../models/Testing");
// const { findOne } = require("../../models/User");

// @route POST api/users
// @desc  Register User
// @access Public

router.post(
  "/",

  body("name", "Name is Required").not().isEmpty(),
  body("email", "Please include a Valid Email").isEmail(),
  body(
    "password",
    "Please enter a Password with 6 or more characters"
  ).isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // See if the User Exists
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User Already Exists" }] });
      }

      // Get Users Gravatar
      const avatar = gravator.url(email, {
        s: "200",
        r: "pg",
        d: "mm",
      });

      // Creating instance of User with details
      user = new User({
        name,
        email,
        avatar,
        password,
      });

      // Encrypt password
      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      // Return jsonWebtoken
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// Practise the Senarios
router.post(
  "/testing",
  body("email", "Please enter valid email").isEmail(),
  body("password", "Password must be 6 char").isLength({ min: 6 }),
  async (req, res) => {
    const { email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let exeUser = await Testing.findOne({ email });
      if (!exeUser) {
        //create a schema
        exeUser = new Testing({
          email,
          password,
        });
        // Hashing the password
        const salt = await bcrypt.genSalt(10);
        exeUser.password = await bcrypt.hash(password, salt);
        // Save the Schema
        exeUser.save();

        // Sending Jwt Token
        const payload = {
          exeUser: {
            emial: exeUser.email,
          },
        };

        jwt.sign(
          payload,
          config.get("jwtSecret"),
          { expiresIn: 360000 },
          (err, token) => {
            // console.log(exeUser);
            if (err) throw err;
            res.json({ token });
          }
        );
      }
      // return res
      //   .status(200)
      //   .json({ msg: { email: email, Password: password } });
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "Server Error" });
    }
  }
);

module.exports = router;
