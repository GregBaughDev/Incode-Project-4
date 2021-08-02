const express = require('express')
const app = express()
const db = require('./conn/conn')
const exphbs = require('express-handlebars')
const session = require('express-session');
const { v4: uuidv4 } = require('uuid');


const users = require('./routes/users')
const schedules = require('./routes/schedules')
const login = require('./routes/login')

const port = process.env.PORT || 3000

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.set('view engine', 'hbs')
app.engine('hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs'
}))

/// Session Middleware
app.use(
  session({
    secret: uuidv4(),
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 3600000 // 1 hour
      // secure: false, // must be true if served via HTTPS
    },
  }));

// Use 'users' and 'schedules' routes w/ Express Router
app.use("/users", users)
app.use("/schedules", schedules)
app.use("/login", login)


  

// Home route
app.get('/', async (req, res) => {
    if (!req.session.loggedIn) return res.redirect('/login')
    const allScheds = await db.any("SELECT * FROM schedules LEFT JOIN users ON schedules.user_id = users.user_id")
    console.log(req.session)
    res.render('index', {allScheds})
})

app.listen(port, () => {
    console.log(`Listening on port http://localhost:${port}`)
})