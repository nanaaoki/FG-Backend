const authRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {requireUser } = require("./utils")


const { checkEmail, createUser, getUserByEmail } = require("../db/users");

//register
authRouter.post("/register", async (req, res) => {
  try {
    console.log(req.body);
    const user = req.body;
    const hasEmail = await checkEmail(user.email);

    if (hasEmail) {
      return res.status(409).send({ message: "Email already taken" });
    }
    const hashedPassword = await bcrypt.hash(
      user.password,
      parseInt(process.env.SALT || 5)
    );
    console.log("here", hashedPassword);
    const newUser = await createUser({ ...user, password: hashedPassword });
    console.log(newUser);
    const token = jwt.sign(
      { userId: newUser.userId },
      process.env.JWT || "anythinghere"
    );
    res.status(201).send({ message: "mission complete", token });
  } catch (error) {
    res.status(500).send({ error, message: "Could not register user" });
  }
});

//login
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await getUserByEmail(email);
    const isSamePassword = await bcrypt.compare(
      password,
      user?.password || "123"
    );
    console.log(email, password);
    console.log(user?.password);
    console.log(user);
    console.log(isSamePassword);
    if (!email || !password) {
      next({
        name: "MissingCredentialsError",
        message: "Please supply both a username and password",
      });
    }
    if (!user || !isSamePassword) {
      return res.status(401).send({ message: "Invalid login credentials" });
    }

    const token = jwt.sign(
      { userId: user.userId },
      process.env.JWT || "anythinghere",
      { expiresIn: "1w" }
    );
    console.log(token);
    res.send({ message: "You are logged in", token });
  } catch (error) {
    res.status(500).send({ error, message: "Could not login user" });
  }
});

// READ /api/users/me
authRouter.get("/me", requireUser, async (req, res, next) => {
  try {
    res.send(req.user);
  } catch (error) {
    next(error);
  }
});

module.exports = authRouter;
