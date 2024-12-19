const jwt = require("jsonwebtoken");
const { env } = require("process");

const generateToken = (logger, rule) => {
  const token = jwt.sign(
    {
      loggerID: logger._id,
      email: logger.email,
      rule: rule,
      name: logger.first_name,
      NID: logger.NID,
      image: logger.image,
    },
    process.env.BCRYPT,
    {
      expiresIn: process.env.EXPERID_TOKEN,
    }
  );

  return token;
};

module.exports = generateToken;
