const express = require('express')
const app = express()
const db = require('./conn/conn')
const exphbs = require('express-handlebars')

const users = require('./routes/users')
const schedules = require('./routes/schedules')

const port = process.env.PORT || 3000

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.set('view engine', 'hbs')
app.engine('hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs'
}))

// Use 'users' and 'schedules' routes w/ Express Router
app.use("/users", users)
app.use("/schedules", schedules)

// Home route
app.get('/', async (req, res) => {
    const allScheds = await db.any("SELECT * FROM schedules LEFT JOIN users ON schedules.user_id = users.user_id")
    res.render('index', {allScheds})
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})