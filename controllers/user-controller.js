const bcrypt = require("bcryptjs");
const db = require("../models");
const { User } = db;

const userController = {
  signUpPage: (req, res) => {
    res.render("signup");
  },
  signUp: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const hash = await bcrypt.hash(password, 10);
      await User.create({
        name,
        email,
        password: hash,
      });
      res.redirect("/signin");
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = userController;
