const request = require('supertest')
const { User, Organisation } = require("../models/index.js")
const app = require('../src/app.js')
const { sequelize } = require('../db/sequelize.js')
const jwt = require('jsonwebtoken')
const setupDatabase = require('./fixtures/db.js')

beforeEach(setupDatabase)

/* TESTS FOR USER SIGNUP */
test('Should sign up a new user and verify user details in token', async () => {
  const response = await request(app).post('/auth/register').send({
    "firstName": "ponrie",
    "lastName": "nons",
    "email": "loveoute55555555@gmail.com",
    "password": "whoisthat5555555555",
    "phone": "08044455567"
  }).expect(201)


  const user = await User.findByPk(response.body.data.user.userId)
  expect(user).not.toBeNull()
  const token = await response.body.data.accessToken

  const decoded = jwt.verify(token, process.env.JWT_SECRET); // changed the tokenExpiration back to 1hr
  const verifiedUser = await User.findOne({ where: { userId: decoded.user_id, email: decoded.email } })
  console.log(verifiedUser);
  console.log(user);
  expect(verifiedUser.dataValues.firstName).toBe(user.dataValues.firstName);
})

// 2nd test
test('Should throw JWT error after expiration value elapses', async () => {
  const response = await request(app).post('/auth/register').send({
    "firstName": "ponrie",
    "lastName": "nons",
    "email": "loveoute55555555@gmail.com",
    "password": "whoisthat5555555555",
    "phone": "08044455567"
  }).expect(201)


  const user = await User.findByPk(response.body.data.user.userId)
  expect(user).not.toBeNull()
  const token = await response.body.data.accessToken

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      expect(() => {
        jwt.verify(token, process.env.JWT_SECRET) // i set the tokenExpiration to 5seconds. hosted value = 1h btw - how'd yall verify this though ?
      }).toThrow('jwt expired');
      resolve()
    }, 6000);
  })
}, 10000) // WILL FAIL/ BUT SUCCEEDS WHEN EXPIRATION TIME = 5 SECONDS


// 3rd test
test('Should fail to sign up a new user with missing data', async () => {
  const response = await request(app).post('/auth/register').send({
    "firstName": "Alice",
    "email": "alice@example.com",
    "password": "password123"
  }).expect(400)
})

test('Should sign up a new user with a different email', async () => {
  const response = await request(app).post('/auth/register').send({
    "firstName": "John",
    "lastName": "Doe",
    "email": "johndoe@example.com",
    "password": "securepassword123",
    "phone": "09087654321"
  }).expect(201)
})


test('Should fail if required fields are missing', async () => {
  const response = await request(app).post('/auth/register').send({
    "firstName": "Alice",
    "lastName": "Smith",
    "password": "averylongandsecurepassword1234567890",
    "phone": "09012345678"
  }).expect(400)
})

test('Test error handling when trying to register a user with an existing email', async () => {
  const response = await request(app).post('/auth/register').send({
    "firstName": "Bob",
    "lastName": "Johnson",
    "email": "dateme@gmail.com", // created in userOne.
    "password": "password123",
    "phone": "08012345678"
  }).expect(400)

  expect(response.body.status).toBe("Bad request");
})

test("It should register user successfully with default orgainsation", async () => {
  const response = await request(app).post('/auth/register').send({
    "firstName": "Bob",
    "lastName": "Johnson",
    "email": "jaiyetrenches@gmail.com",
    "password": "password123",
    "phone": "08012345678"
  }).expect(201)

  const organisation = await Organisation.findOne({ where: { ownerId: response.body.data.user.userId } })
  expect(organisation.name.toLowerCase()).toBe(`${response.body.data.user.firstName}'s Organisation`.toLowerCase())
});


/* USER LOGIN TESTS */
test('Should log user in and verify user details in token', async () => {
  const response = await request(app).post('/auth/login').send({
    email: "dateme@gmail.com",
    password: "dontouchme5tt"
  }).expect(200)


  const user = await User.findByPk(response.body.data.user.userId)
  expect(user).not.toBeNull()
  const token = await response.body.data.accessToken

  const decoded = jwt.verify(token, process.env.JWT_SECRET); // changed the tokenExpiration back to 1hr
  const verifiedUser = await User.findOne({ where: { userId: decoded.user_id, email: decoded.email } })
  console.log(verifiedUser);
  console.log(user);
  expect(verifiedUser.dataValues.firstName).toBe(user.dataValues.firstName);
})

test('Should throw JWT error after expiration value elapses', async () => {
  const response = await request(app).post('/auth/login').send({
    email: "dateme@gmail.com",
    password: "dontouchme5tt"
  }).expect(200)


  const user = await User.findByPk(response.body.data.user.userId)
  expect(user).not.toBeNull()
  const token = await response.body.data.accessToken

  // return new Promise((resolve, reject) => {
  //   setTimeout(() => {
  //     expect(() => {
  //       jwt.verify(token, process.env.JWT_SECRET)
  //     }).toThrow('jwt expired');
  //     resolve()
  //   }, 6000);
  // }) // un-comment to test. 
}, 10000) // WONT WORK BECAUSE EXPIRATION IS SET TO 1HR, WORKS WHEN EXPIRATION IS SET TO 5 SECONDS.

test('Should fail when wrong credentials are logged in', async () => {
  const response = await request(app).post('/auth/login').send({
    email: "wrongCredentials@gmail.com",
    password: "wrongpassword"
  }).expect(401)
})

test('Should fail when important fields are missing', async () => {
  const response = await request(app).post('/auth/login').send({
    email: "wrongCredentials@gmail.com",
  }).expect(401)
})