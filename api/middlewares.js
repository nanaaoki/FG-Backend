const jwt = require("jsonwebtoken");
const { getUserById } = require("../db/users");

const checkToken = async (req, res, next) => {
  try {
    const prefix = "Bearer ";
    const auth = req.header("Authorization");
    const token = auth?.slice(prefix.length);
    if (token) {
      const { userId } = jwt.verify(token, process.env.JWT || "anythinghere");
      req.user = await getUserById(userId);
    }
    next();
  } catch (error) {
    return res.status(500).send("Must send bearer token");
  }
};

const checkProduct = async (req, res, next) => {
  const { title, price, category, img_url, description, condition } = req.body;
  const { userId } = req.user;

  if (
    !title ||
    !price ||
    !category ||
    !img_url ||
    !description ||
    !condition ||
    !userId
  ) {
    return res.status(400).send({ message: "Please provide all product data" });
  }
  next();
};

module.exports = { checkToken, checkProduct };
