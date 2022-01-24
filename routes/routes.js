const User = require("../models/user");
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });

  const result = await user.save();
  const { password, ...data } = await result.toJSON();
  res.send(data);
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(404).send({
      body: {
        message: "user not found",
      },
    });
  }

  if (!(await bcrypt.compare(req.body.password, user.password))) {
    return res.status(400).send({
      body: {
        message: "invaid credentials",
      },
    });
  }

  const token = jwt.sign({ id: user.id }, "secret");
  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });
  res.send({ message: "success" });
});

router.get("/user", async (req, res) => {
  try {
    const cookie = req.cookies["jwt"];

    const claims = jwt.verify(cookie, "secret");

    if (!claims) {
      return res.status(401).send({
        body: {
          message: "unauthenticated",
        },
      });
    }

    const user = await User.findOne({ id: claims.id });
    const { password, ...data } = await user.toJSON();
    res.send(data);
  } catch (e) {
    return res.status(401).send({
      body: {
        message: "unauthenticated",
      },
    });
  }
});

router.post("/logout", (req, res) => {
  res.cookie("jwt", " ", { maxAge: 0 });
  res.send({ message: "successful logout" });
});

module.exports = router;
