const jwt = require('jsonwebtoken');
const { User } = require('../models/index.js');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace("Bearer ", "")
    if (!token) return res.status(404).send({ error: "Please log in" })

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ where: { userId: decoded.user_id, email: decoded.email } })

    if (!user) {
      res.status(404).send({ error: "Please authenticate" });
    }

    const userDetails = {
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || null
    }

    req.token = token;
    req.user = userDetails;
    next()
  } catch (err) {
    res.status(401).send({ error: "Please authenticate" })
  }
}

module.exports = auth;