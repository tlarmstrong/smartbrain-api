const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

require("dotenv").config();

const register = require('./controllers/register');
const image = require('./controllers/image');
const detect = require('./controllers/detect');
const profile = require('./controllers/profile');
const signIn = require('./controllers/sign-in');

const connection = {
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
  database: process.env.DATABASE_NAME,
}

if(process.env.DATABASE_URL) {
  connection.connectionString = process.env.DATABASE_URL,
  connection.ssl = { rejectUnauthorized: false }
}

const db = knex({
  client: process.env.DATABASE_CLIENT,
  connection: connection,
  debug: true
});

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Ready to go!');
})

// req and res are captured in initial get request
app.post('/signin', signIn.handleSignIn(db, bcrypt));
app.post('/register', register.handleRegister(db, bcrypt));

app.post('/fetchFaceDetectionOutputs', detect.detectFace());
app.put('/image', image.addImage(db));

app.get('/profile/:id', profile.getUserProfile(db));

app.listen(3000, () => {
  console.log('app is running on port 3000');
})
