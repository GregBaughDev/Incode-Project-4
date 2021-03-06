const express = require('express')
const app = express()
const db = require('./conn/conn')
const methodOverride = require('method-override')
const exphbs = require('express-handlebars')
const session = require('express-session');
const { v4: uuidv4 } = require('uuid');
const path = require('path')
const{ redirectToLogin } = require('./helpers/middleware');

const users = require('./routes/users')
const schedules = require('./routes/schedules')
const login = require('./routes/login')
const logout = require('./routes/logout')
const signup = require('./routes/signup')
const email = require('./routes/mailer')

const port = process.env.PORT || 3000

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(express.static('public'))
app.set('public', path.join(__dirname, 'public'))

app.use(methodOverride('_method'))

app.set('view engine', 'hbs')
app.engine('hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs'
}))

/// Session Middleware
app.use(session ({
    name: "mrCoffeeEmployees",
    secret: uuidv4(),
    resave: false,
    saveUninitialized: false,
}))

// Use 'users' and 'schedules' routes w/ Express Router
app.use("/users", users)
app.use("/schedules", schedules)
app.use("/login", login)
app.use("/logout", logout)
app.use("/signup", signup)
app.use("/email", email)


// Home route
app.get('/', redirectToLogin , async  (req, res) => {
    const allScheds = await db.any("SELECT * FROM schedules LEFT JOIN users ON schedules.user_id = users.user_id")
    res.render('index', {allScheds})
})
// home sort
app.get('/sort/day', redirectToLogin , async  (req, res) => {
    let allScheds = await db.any("SELECT * FROM schedules LEFT JOIN users ON schedules.user_id = users.user_id")
    allScheds = allScheds.slice().sort((a, b) => a.day - b.day)
    res.render('index', {allScheds})
})
app.get('/sort/name', redirectToLogin , async  (req, res) => {
    let allScheds = await db.any("SELECT * FROM schedules LEFT JOIN users ON schedules.user_id = users.user_id")
    allScheds = allScheds.slice().sort((a, b) => a.first_name.localeCompare(b.first_name))
    res.render('index', {allScheds})
})

// 404
app.get("*", redirectToLogin, (req, res) => {
    res.render("error", { error: "404"});
  });

app.listen(port, () => {
    console.log(`Listening on port http://localhost:${port}`)
})
