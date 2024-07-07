const express = require('express')
const router = new express.Router()
const { sequelize } = require('../db/sequelize.js')
const { User, Organisation } = require('../models/index.js')
const auth = require('../middleware/auth.js')


// returns organistion @ ID 
router.get('/api/organisations/:orgId', auth, async (req, res) => {
  try {
    const id = req.params.orgId;
    const organisation = await Organisation.findOne({ where: { orgId: id, ownerId: req.user.userId } })
    if (!organisation) return res.status(404).send({ message: "Organisation does not exist" })
    res.status(200).send({
      status: "success",
      message: "Fetch successful",
      data: {
        orgId: organisation.orgId,
        name: organisation.name,
        description: organisation.description || null
      }
    })
  } catch (err) {
    res.status(401).send({
      status: "Bad request",
      message: "Fetch failed",
      statusCode: 401
    })
  }
})

// gets user's organisations -- creeated and joined
router.get('/api/organisations', auth, async (req, res) => {
  try {
    const createdOrgs = await Organisation.findAll({ where: { ownerId: req.user.userId } });
    const user = await User.findOne({ where: { userId: req.user.userId } });
    const joinedOrgs = await user.getOrganisations(); // fucking works LFGGGG

    res.send({
      status: "success",
      message: "Fetch successful",
      createdOrgs, joinedOrgs
    })
  } catch (err) {
    res.status(404).send({
      status: "Bad request",
      message: "Fetch failed",
      statusCode: 404
    })
  }
})

// creates organisation
router.post('/api/organisations', auth, async (req, res) => {
  try {
    await sequelize.sync()
    const organisation = await Organisation.create({
      name: req.body.name,
      description: req.body.description,
      ownerId: req.user.userId
    });
    res.status(201).send({
      status: "success",
      message: 'Organisation created successfully',
      data: {
        orgId: organisation.orgId.toString(),
        name: organisation.name,
        description: organisation.description || null
        // UserUserId
      }
    })
  } catch (err) {
    res.status(400).send({
      status: "Bad request",
      message: "Client error",
      statusCode: 400
    })
  }
})

router.post('/api/organisations/:orgId/users', async (req, res) => {
  try {
    const { userId } = req.body;
    const organisation = await Organisation.findByPk(req.params.orgId);
    if (!organisation) return res.status(404).send({ message: "Organisation does not exist" });

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).send({ message: "User not found" })

    if (await user.hasOrganisation(organisation)) return res.status(200).send({ message: "User already exists in organisation" })
    await user.addOrganisation(organisation);
    res.send({ status: "success", message: "User added to organisation" })
  } catch (err) {
    res.status(404).send({
      status: "Bad request",
      message: "Fetch failed",
      statusCode: 404
    })
  }
})

// we have to check if user is present in org to prevent double addition. how do we do that?
// need to fix-- it works now.

module.exports = router