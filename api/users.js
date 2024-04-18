const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { requireUser } = require("./utils");
const { JWT_SECRET } = process.env;

const { getAllUsers } = require("../db/users");

//CREATE /api/users/login
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both a username and password",
    });
  }

  try {
    const user = await getUser({ email, password });
    if (!user) {
      next({
        name: "IncorrectCredentialsError",
        message: "Username or password is incorrect",
      });
    } else {
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {expiresIn: "1w",});
      res.send({ user, message: "you're logged in!", token });
    }
  } catch (error) {
    next(error);
  }
});


// CREATE /api/users/register
router.post('/register', async (req, res, next) => {
    try {
      const {email, password} = req.body;
      const queriedUser = await getUserByEmail(email);
      if (queriedUser) {
        res.status(401);
        next({
          name: 'UserExistsError',
          message: 'A user with that email already exists'
        });
      } else if (password.length < 8) {
        res.status(401);
        next({
          name: 'PasswordLengthError',
          message: 'Password Too Short!'
        });
      } else {
        const user = await createUser({
          email,
          password
        });
        if (!user) {
          next({
            name: 'UserCreationError',
            message: 'There was a problem registering you. Please try again.',
          });
        } else {
          const token = jwt.sign({id: user.id, email: user.email}, JWT_SECRET, { expiresIn: '1w' });
          res.send({ user, message: "you're signed up!", token });
        }
      }
    } catch (error) {
      next(error)
    }
  })
  
  // READ /api/users/me
  router.get('/me', requireUser, async (req, res, next) => {
    try {
      res.send(req.user);
    } catch (error) {
      next(error)
    }
  })
  


module.exports = router;
