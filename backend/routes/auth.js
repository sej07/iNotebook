//importing express
const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const User = require("../models/User");
//importing bcrypt
const bcrypt = require("bcryptjs");
//importing jwt
const JWT_SECRET = "Thisisa@mernapp";
var jwt = require("jsonwebtoken");
var fetchUser= require("../middleware/fetchUser");

//Route 1: create a user using : POST "/api/auth/createuser" //No login required
router.post(
  "/createuser",
  [
    body("email").isEmail(),
    body("name").isLength({ min: 3 }),
    body("password").isLength({ min: 3 }),
  ],
  async (req, res) => {
    //Validation check
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //returning bad request if error
      return res.status(400).json({ errors: errors.array() });
    }
    //Check whether the user with the same email exists already
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "user with this email already exists" });
      }
      //creating secured password using bcryptjs adding hash and salt
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      //create user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });
      //jwt(json web token - way to verify a user)
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      res.json({ authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send({"Error":"error"});
    }
  }
);

//Route 2: Authenticate a user using : POST "/api/auth/login" //No login required
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //returning bad request if error
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      console.log("Received login request for email:", email);
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: "Enter Valid credentials" });
      }
      const passCompare = await bcrypt.compare(password, user.password);
      if (!passCompare) {
        return res.status(400).json({ error: "Enter Valid credentials" });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      res.json({ authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send({"Error":"error"});
    }
  }
);

//Route 3: Get loggedin user details using : POST "/api/auth/getuser" //login required
router.post(
  "/getuser",fetchUser, async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId).select("-password");
      res.send(user);
    } catch (error) {
      console.error(error.message);
      res.status(500).send({"Error":"error"});
    }
  }
);
module.exports = router;
