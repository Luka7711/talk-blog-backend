const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const PORT = process.env.PORT;
const db = require("./db/db");
const User = require("./models/user");
require("dotenv").config();

app.use(express.json()); //Used to parse JSON bodies
app.use(express.urlencoded()); //Parse URL-encoded bodies

const domains = [process.env.LOCAL_DOMAIN, process.env.HEROKU_DOMAIN];

app.use((req, res, next) => {
  let thisDomain = domains.indexOf(req.header("Origin"));
  res.setHeader("Access-Control-Allow-Origin", domains[thisDomain]);
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authoriztion"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET", "POST", "PUT", "DELETE");
});

app.post("/new-user", (req, res) => {
  bcrypt.genSalt(saltRounds, function (err, salt) {
    bcrypt.hash(req.body.password, salt, async (err, hash) => {
      await User.create({ username: req.body.username, password: hash });
      res.send("success");
    });
  });
});

app.get("/:user", async (req, res, next) => {
  try {
    console.log(req.params);
    const currentUser = await User.findOne({ username: req.params.user });
    console.log(currentUser);
    res.send({ data: currentUser });
  } catch (err) {
    next(err);
  }
});

app.get("/:username/:password", async (req, res, next) => {
  // find user with username
  const foundUser = await User.findOne({ username: req.params.username });
  // compare passwords
  console.log(foundUser.password);
  const psw = bcrypt.compare(
    req.params.password,
    foundUser.password,
    (err, result) => {
      if (result === true) {
        res.send({
          user: foundUser,
        });
      } else {
        res.send({
          user: "Password is not correct",
        });
      }
    }
  );
});

app.listen(PORT || 9000, () => {
  console.log("listening on port 9000");
});
