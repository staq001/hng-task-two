const express = require('express')
const router = new express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { sequelize } = require('../db/sequelize.js')
const { User, Organisation } = require('../models/index.js')
const auth = require('../middleware/auth.js')

/* CREATE USER */
router.post("/auth/register", async (req, res) => {
  try {
    // synchroninize all models;
    await sequelize.sync();
    const user = await User.create(req.body);

    // // generating token
    const token = jwt.sign({ user_id: user.userId, email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES })

    res.status(201).send({
      status: "success",
      message: "User successfully created!",
      data: {
        accessToken: token,
        user: {
          userId: user.userId.toString(),
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone || null
        }
      }
    });
  } catch (err) {
    // lets take a look at the Error module later please;
    res.status(400).send({
      status: "Bad request",
      message: "Registration unsuccessful",
      statusCode: 400
    });
  }
})

/* LOGIN USER */
router.post('/auth/login', async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } })
    if (!user) return res.status(401).send({ message: "Wrong Email/Password combination" })
    const password = bcrypt.compare(req.body.password, user.password)
    if (!password) return res.status(401).send({ message: "Wrong Email/Password combination" })

    // // generating token
    const token = jwt.sign({ user_id: user.userId, email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES })

    res.status(200).send({
      status: "success",
      message: "Login successful",
      data: {
        accessToken: token,
        user: {
          userId: user.userId.toString(),
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone || null
        }
      }
    })
  } catch (err) {
    res.status(401).send({
      status: "Bad request",
      message: "Authentication failed",
      statusCode: 401
    });
  }
})

// returns authenticated user profile.
router.get('/users/me', auth, (req, res) => {
  try {
    return res.status(200).send({ user: req.user })
  } catch (err) {
    res.status(404).send(err)
  }
})

// returns user record
router.get('/api/users/:id', auth, async (req, res) => {
  try {
    const { id } = req.params
    const user = await User.findOne({ where: { userId: id } })
    res.status(200).send({
      status: "success",
      message: "Fetch successful",
      data: {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || null
      }
    })
  } catch (err) {
    res.status(404).send({
      status: "Bad request",
      message: "Fetch failed",
      statusCode: 404
    })
  }
})



module.exports = router