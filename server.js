const express = require('express')
const app = express()
const port = 8000
const path = require('path')
const User = require("./models/User")
const connection = require("./database/connection")
const session = require('express-session')
require('dotenv').config()

connection()
// set the view engine to ejs
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, '/static')))

//Session
app.set("trust proxy", 1)
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: {},
  })
)

app.get('/', (req, res) => {
  res.render('index')
})
app.get('/inloggen', (req, res) => {
  res.render('inloggen')
})
app.get('/account', async(req,res) => {
  const {username, email} = req.session.user
  res.render('account', {
      username: username,
    email: email
  })
  })
  app.post('/uitloggen', (req, res) => {
    req.session.destroy()
    res.redirect('/')
  })
  app.post("/inloggen", async (req, res) => {
    const currentUser = await User.findOne({
      username: req.body.username,
    })
    console.log(req.body.username)
    req.session.user = {
      username: currentUser.username,
      password: currentUser.password,
      email: currentUser.email,
    }
    res.redirect("/account")
  })
  app.post("/update", async (req, res) => {
    await User.findOneAndUpdate(
      {
        username: req.session.user.username,
      },
      {
        username: req.body.username,
        email: req.body.email,
      }
    );
    req.session.user.username = req.body.username;
    req.session.user.email = req.body.email;
    res.redirect("/account");
  });
  app.get('*', (req, res) => {
    res.render('404')
  })
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})