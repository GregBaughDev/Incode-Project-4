const express = require('express')
const app = express()
const exphbs = require('express-handlebars')

const port = process.env.PORT || 3000

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.set('view engine', 'hbs')
app.engine('hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs'
}))

app.get('/', (req, res) => {
    res.render('index')
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})